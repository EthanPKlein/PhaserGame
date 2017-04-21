
var definitions = {};

definitions["asteroid"] = { hp: 1, money: 100, particle: "asteroidParticle", sprites: ["asteroid"]};
definitions["comet"] = { hp: 2, money: 200, particle: "cometParticle", sprites: ["comet_0", "comet_1"]};
definitions["iron"] = { hp: 3, money: 300, sprites: ["iron_0", "iron_1", "iron_2"]};
definitions["alien"] = { hp: 6, money: 500, sprites: ["ship_0", "ship_1", "ship_2", "ship_3", "ship_4", "ship_5"]};
definitions["bouncy"] = { hp: 2, money: 250, sprites: ["bouncy_0", "bouncy_1"]};

export default definitions;