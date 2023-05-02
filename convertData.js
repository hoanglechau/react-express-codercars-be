// This file is used to transform data from csv to json
const fs = require("fs");
const csv = require("csvtojson");

const convertData = async () => {
  let newData = await csv().fromFile("./data/data.csv");
  let data = JSON.parse(fs.readFileSync("./data/cars.json"));

  newData = newData.slice(0, 200).map(item => {
    return {
      make: item.Make,
      model: item.Model,
      release_date: item.Year,
      transmission_type: item["Transmission Type"],
      size: item["Vehicle Size"],
      style: item["Vehicle Style"],
      price: item.MSRP,
    };
  });

  data = newData;

  fs.writeFileSync("./data/cars.json", JSON.stringify(data));

  console.log("Data converted successfully!");
};

convertData();
