import { v4, } from 'uuid';

import { 
  Room,
  Hotel,
} from '../database/models/index.js';

export async function createHotel(req, res) {
   const {
    name,
  } = req.body;

  try {
    const hotelByName = await Hotel.findOne({
      where: {
        name,
      },
    });
    if (hotelByName) {
      return res
      .status(400)
      .json({
        success: false,
        message: 'Ya existe un hotel con el mismo nombre',
      });
    }

    await Hotel.create({
      id: v4(),
      ...req.body,
    });

    return res
      .status(201)
      .json({
        success: true,
        message: 'Se ha creado el hotel',
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

export async function updateHotel(req, res) {
  const {
    id,
  } = req.params;

  try {
    const hotelById = await Hotel.findOne({
      where: { 
        id, 
      },
    });
    if (!hotelById) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'El hotel a actualizar no existe',
        });
    }

    const updatedHotel = {
      ...hotelById,
      ...req.body,
    };

    await Hotel.update({
      ...updatedHotel,
    }, {
      where: {
        id,
      },
    });

    return res
      .status(201)
      .json({
        success: true,
        message: `Se ha actualizado el hotel ${id}`,
        data: {
          ...updatedHotel,
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

export async function deleteHotel(req, res) {
  const {
    id,
  } = req.params;

  try {
    const hotelById = await Hotel.findOne({
      where: { 
        id, 
      },
    });
    if (!hotelById) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'El hotel a actualizar no existe',
        });
    }

    // 1. Opcion: Borrado fisico
    // DELETE FROM Hotels WHERE id = $id;
    await Hotel.destroy({
      where: {
        id,
      },
    });

    // 2. Opcion: Borrado logico
    // await Hotel.update({
    //   isActive: false,
    // }, {
    //   where: {
    //     id,
    //   },
    // });

    return res
      .status(200)
      .json({
        success: true,
        message: `Se ha eliminado el hotel ${id}`,
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

export async function createRoom(req, res) {
  const {
    codeName,
    hotelId,
  } = req.body;

  try {
    const hotelById = await Hotel.findOne({
      where: {
        id: hotelId,
      },
    });
    if (!hotelById) {
      return res
      .status(400)
      .json({
        success: false,
        message: 'No existe el hotel a cual quiere relacionar la habitacion',
      });
    }

    const roomByCodeName = await Room.findOne({
      where: {
        codeName,
      },
    });

    if (roomByCodeName) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Ya hay una habitacion creada con el nombre clave',
        });
    }
    
    await Room.create({
      id: v4(),
      ...req.body,
      HotelId: hotelId,
    });

    return res
      .status(201)
      .json({
        success: true,
        message: `Se ha creado la habitacion para el hotel ${hotelId}`,
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

export async function updateRoom(req, res) {
  const {
    codeName,
  } = req.params;

  try {
    const roomByCodeName = await Room.findOne({
      where: { 
        codeName, 
      },
    });
    if (!roomByCodeName) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'La habitacion a actualizar no existe',
        });
    }

    const updatedRoom = {
      ...roomByCodeName,
      ...req.body,
    };

    await Room.update({
      ...updatedRoom,
    }, {
      where: {
        codeName,
      },
    });

    return res
      .status(201)
      .json({
        success: true,
        message: `Se ha actualizado la habitacion ${codeName}`,
        data: {
          ...updatedRoom,
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

export async function deleteRoom(req, res) {
  const {
    codeName,
  } = req.params;

  try {
    const roomByCodeName = await Room.findOne({
      where: { 
        codeName, 
      },
    });
    if (!roomByCodeName) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'La habitacion ya fue borrada previamente o no existe',
        });
    }

    // 1. Opcion: Borrado fisico
    // DELETE FROM Rooms WHERE codeName = $codeName;
    await Room.destroy({
      where: {
        codeName,
      },
    });

    return res
      .status(200)
      .json({
        success: true,
        message: `Se ha eliminado la habitacion ${codeName}`,
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