import { User,} from './user.model.js';
import { Hotel, } from './hotel.model.js';
import { Room, } from './room.model.js';
import { Reservation, } from './reservation.model.js';

// Uno a muchos en sequelize
Hotel.hasMany(Room);
Room.belongsTo(Hotel);

// Muchos a muchos en sequelize

// Modelo User
User.belongsToMany(Room, { 
  through: Reservation,
  foreignKey: 'userId',
  otherKey: 'roomId'
});

// Modelo Room
Room.belongsToMany(User, { 
  through: Reservation,
  foreignKey: 'roomId',
  otherKey: 'userId'
});

// Modelo Reservation
Reservation.belongsTo(User, { foreignKey: 'userId' });
Reservation.belongsTo(Room, { foreignKey: 'roomId' });
User.hasMany(Reservation, { foreignKey: 'userId' });
Room.hasMany(Reservation, { foreignKey: 'roomId'});

  (async () => {
    await User.sync({ 
      // force: true 
    });
    await Hotel.sync({ 
      // force: true 
    });
    await Room.sync({ 
      // force: true 
    });
    await Reservation.sync({ 
      // force: true 
    });
  })();
  
  export { User, Room, Hotel, Reservation, };