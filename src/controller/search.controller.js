import { Op, } from 'sequelize';

import {
  Hotel, 
  Room,
  User,
} from '../database/models/index.js';

export async function findAllHotelsBySearch(req, res) {
  const {
    value,
  } = req.query;

  // .trim() elimina espacios innecesarios

  const searchValue = value ? value.toLowerCase().trim() : "";

  // const searchValue = value.toLowerCase().trim();

  try {
    const hotelsBySearch = await Hotel.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${searchValue}%`,
            }
          },
          {
            description: {
              [Op.like]: `%${searchValue}%`,
            },
          },
          {
            city: {
              [Op.like]: `%${searchValue}%`,
            }
          },
          {
            country: {
              [Op.like]: `%${searchValue}%`,
            }
          }
        ]
      },
    });

    const roomsBySearch = await Room.findAll({
      where: {
        [Op.or]: [
          {
            codeName: {
              [Op.like]: `%${searchValue}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${searchValue}%`,
            },
          }
        ],
      },
    });

    const usersBySearch = await User.findAll({
      where: {
        [Op.or]: [
          {
            givenName: {
              [Op.like]: `%${searchValue}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${searchValue}%`,
            },
          },
        ],
      },
    });

    return res
      .status(200)
      .json({
        success: true,
        length: (roomsBySearch?.length ?? 0) + (hotelsBySearch?.length ?? 0),
        data: {
          rooms: roomsBySearch,
          hotels: hotelsBySearch,
          users: usersBySearch,
        },
      });
  } catch (e) {
    return res
      .status(400)
      .json({
        success: false,
        message: `Algo salio mal. Error: ${value}`,
      });
  }
}