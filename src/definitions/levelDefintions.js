
var definitions = [

    {
        enemies: { asteroid: 3 },
        pickups: { ammo: 1, bigTime: 1 }
    },

    {
        enemies: { asteroid: 7, },
        pickups: { ammo: 1, time: 1 }
    },

    {
        enemies: { asteroid: 12, comet: 2, },
        pickups: { ammo: 2, time: 1 }
    },

    {
        enemies: { asteroid: 15, comet: 5, },
        pickups: { ammo: 2, health: 1, time: 2 }
    },

    {
        enemies: { asteroid: 15, comet: 8, iron: 2, },
        pickups: { ammo: 1, bigAmmo: 1, time: 2 }
    },

    {
        enemies: { asteroid: 12, comet: 12, iron: 5, },
        pickups: { ammo: 2, bigAmmo: 1, health: 2, time: 3 }
    },

    {
        enemies: { asteroid: 9, comet: 15, iron: 6, alien: 1, },
        pickups: { bigAmmo: 3, bigTime: 2 }
    },

    {
        enemies: { asteroid: 3, comet: 23, iron: 14, alien: 2, },
        pickups: { bigAmmo: 3, bigHealth: 2, time: 2, bigTime: 2  }
    },

    {
        enemies: { comet: 30, iron: 20, alien: 3, },
        pickups: { bigAmmo: 2, health: 3, time: 4 }
    },

    {
        enemies: { comet: 25, iron: 30, alien: 4, },
        pickups: { bigAmmo: 2, time: 2, bigTime: 2 }
    },

    {
        enemies: { alien: 99 },
        pickups: {}
    },
];

export default definitions;