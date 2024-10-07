import { v4 } from "uuid";
import { Op } from "sequelize";
import { Room, Reservation, User } from "../database/models/index.js";

export async function createReservation(req, res) {
  const { startDate, endDate, nightsQuantity, roomId } = req.body;

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "El usuario de la reserva no existe",
    });
  }

  try {
    if (nightsQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "La cantidad de noches no puede ser menor a 1",
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "El rango de fechas no concuerda, revise su reserva",
      });
    }

    // Para verificar que no reserve antes de la fecha actual

    const nowDate = new Date();
    const currentStartDate = new Date(startDate);
    const currentEndDate = new Date(endDate);

    // La diferencia en milisegundos
    const differenceInTime = currentEndDate - currentStartDate;

    // Convertir la diferencia de tiempo en días
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    // Determinar si la fecha de inicio de la reserva en actual o futura
    if (currentStartDate < nowDate) {
      return res.status(400).json({
        success: false,
        message: "No se puede reservar una fecha pasada o inmediata.",
      });
    }

    // Confirma que el valor de noches concuerde con los dias
    if (
      differenceInDays < nightsQuantity ||
      differenceInDays - 1 > nightsQuantity
    ) {
      return res.status(400).json({
        success: false,
        message: "La cantidad de noches no concuerdan con los dias reservados.",
      });
    }

    const room = await Room.findOne({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "La habitación no existe",
      });
    }

    // Aqui codigo para validar el rango de fechas, en caso de que la
    // reserva ya este hecha en ese rango, no se puede realizar.
    const oldReservations = await Reservation.findAll({
      where: {
        roomId: roomId,
        [Op.or]: [
          {
            startDate: {
              [Op.lte]: endDate,
            },
            endDate: {
              [Op.gte]: startDate,
            },
          },
        ],
      },
    });

    if (oldReservations.length > 0) {
      const busyDates = oldReservations.map((reservation) => {
        // Se hace set de las fechas para que sean legibles
        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };

        // Se transforma a formato colombia
        const formattedStartDate = start.toLocaleString("es-CO", options);
        const formattedEndDate = end.toLocaleString("es-CO", options);

        return `${formattedStartDate} - ${formattedEndDate}`;
      });

      return res.status(400).json({
        success: false,
        message: `La habitación ya está reservada en el siguiente rango de fechas: ${busyDates.join(
          ", "
        )}`,
      });
    }

    // Cumpliendo todas las condiciones, reserva la habitacion
    const reservation = await Reservation.create({
      id: v4(),
      startDate,
      endDate,
      nightsQuantity,
      total: room?.pricePerNight * nightsQuantity,
      userId: userId,
      roomId: roomId,
    });

    return res.status(201).json({
      success: true,
      message: "Reserva creada",
      data: { oldReservations },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Algo salio mal. Error: ${err.message}`,
    });
  }
}

export async function getAllReservations(req, res) {
  const userId = req.userId;

  try {
    const userReservations = await User.findOne({
      include: [
        {
          model: Reservation,
          include: [
            {
              model: Room,
              attributes: ['id', 'codeName', 'photos'],
            },
          ],
          where: {
            userId: userId,
          },
        },
      ],
      where: {
        id: userId,
      },
    });

    if (!userReservations || !userReservations.reservations) {
      return res.status(404).json({
        success: false,
        message: "El usuario no tiene reservaciones",
        data: userReservations,
      });
    }

    return res.status(200).json({
      success: true,
      data: userReservations.reservations,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Algo salió mal. Error: ${err.message}`,
    });
  }
}

export async function updateReservation(req, res) {
  const {
    id,
  } = req.params;

  try {
    const dateById = await Reservation.findOne({
      where: { 
        id, 
      },
    });
    if (!dateById) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'La reserva a actualizar no existe',
        });
    }

    const updatedReservation = {
      ...dateById,
      ...req.body,
    };

    await Reservation.update({
      ...updatedReservation,
    }, {
      where: {
        id,
      },
    });

    return res
      .status(201)
      .json({
        success: true,
        message: `Se ha actualizado la reserva: ${id}`,
        data: {
          ...updatedReservation,
        },
      });
  } catch (err) {
    return res
      .status(400)
      .json({
        success: false,
        message: `Algo salio mal. Error: ${err.message}`,
      });
  }
}



