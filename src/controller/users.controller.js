import {User,} from '../database/models/index.js';

export async function getCurrentUserInfo(req, res) {
    const userId = req.userId;
    if (!userId) return res
        .status(401)
        .json({
            success: false,
            message: "No se puede obtener el ID del usuario."
        });

    try{
        const user = await User.findOne({
            attributes: ["id","email","givenName","lastName",
                "phoneNumber", "address", "isAdmin", "createdAt",
                "updatedAt"
            ],
            where:{
                id: userId,
            }
        });

        if (!user) return res
            .status(404)
            .json({
                success: false,
                message: "No se pudo encontrar el usuario."
            });
        
        return res
            .status(200)
            .json({
                success: true,
                data: user.dataValues,
            })
    }catch(err){
        return res
            .status(400)
            .json({
                success: false,
                message: "Algo salio mal con la obtencion de la info."
            })
    }
}

export async function getUserById(req, res) {
    const {id} = req.params;
    if (!id) return res
        .status(400)
        .json({
            success: false,
            message: 'Falta el id del usuario.'
        });

    try{
        const user = await User.findOne({
            where: {
                id,
            }
        });

        if(!user) return res
            .status(404)
            .json({
                success: false,
                message: 'Usuario no existe.'
            })

        const userResponse = {
            ...user.dataValues,
        }

        delete userResponse.password;

        return res
            .status(200)
            .json({
                success: true,
                data: userResponse,
            })

    } catch (err){
        return res
        .status(500)
        .json({
            success: false,
            message: 'Something went wrong.'
        });
    }
}

export async function updateUser(req, res) {
  const { id } = req.params;

  try {
    const userById = await User.findOne({
      where: { id },
    });

    if (!userById) {
      return res.status(404).json({
        success: false,
        message: 'El usuario a actualizar no existe',
      });
    }

    // Crear un objeto con los datos actualizados
    const updatedUserData = {
      ...userById.dataValues, // Asegúrate de usar los datos actuales del usuario
      ...req.body,
    };

    // Actualizar el usuario en la base de datos
    await User.update(updatedUserData, {
      where: { id },
    });

    // Obtener el usuario actualizado para asegurar que los datos son correctos
    const updatedUser = await User.findOne({
      where: { id },
    });

    return res.status(201).json({
      success: true,
      message: `Se ha actualizado el usuario con email ${updatedUser.email}`,
      data: {
        ...updatedUser.dataValues,
      },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Algo salio mal. Error: ${err.message}`,
    });
  }
}
