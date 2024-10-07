import {
    Room,
    Hotel,
  } from '../database/models/index.js'
  
  export async function getAllHotels(req, res) {
    const hotels = await Hotel.findAll({
      where: {
        isActive: true,
      },
      order: [['name', 'ASC']] // A-Z
    });
  
    return res
      .status(200)
      .json({
        success: true,
        length: hotels?.length,
        data: hotels ?? [],
      });
  }
  
  export async function getHotelById(req, res) {
    const {
      id,
    } = req.params;
  
    try {
      const hotel = await Hotel.findOne({
        where: {
          id,
        },
        include: {
          model: Room,
        },
      });
  
      if (!hotel) {
        return res
          .status(404)
          .json({
            success: false,
            message: 'Hotel not found',
          });
      }
  
      return res
        .status(200)
        .json({
          success: true,
          data: hotel,
        });
    } catch (err) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Something went wrong',
        });
    }
  }