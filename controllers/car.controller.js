const Car = require("../models/Car");
const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils/helpers");

// Default allowed data
const carTypes = [
	"MANUAL",
	"AUTOMATIC",
	"AUTOMATED_MANUAL",
	"DIRECT_DRIVE",
	"UNKNOWN",
];

const carStyles = [
	"2dr Hatchback",
	"2dr SUV",
	"4dr Hatchback",
	"4dr SUV",
	"Cargo Minivan",
	"Cargo Van",
	"Convertible",
	"Convertible SUV",
	"Coupe",
	"Crew Cab Pickup",
	"Passenger Minivan",
	"Passenger Van",
	"Regular Cab Pickup",
	"Sedan",
	"Wagon",
];

const carMake = [
	"Acura",
	"Aston Martin",
	"Audi",
	"BMW",
	"Bentley",
	"Buick",
	"Cadillac",
	"Chevrolet",
	"Chrysler",
	"Dodge",
	"FIAT",
	"Ferrari",
	"Ford",
	"GMC",
	"HUMMER",
	"Honda",
	"Hyundai",
	"Infiniti",
	"Kia",
	"Lamborghini",
	"Land Rover",
	"Lexus",
	"Lincoln",
	"Lotus",
	"Maserati",
	"Maybach",
	"Mazda",
	"Mercedes-Benz",
	"Mitsubishi",
	"Nissan",
	"Oldsmobile",
	"Plymouth",
	"Pontiac",
	"Porsche",
	"Rolls-Royce",
	"Saab",
	"Scion",
	"Subaru",
	"Suzuki",
	"Tesla",
	"Toyota",
	"Volkswagen",
	"Volvo",
];

// Create a new car
const createCar = async (req, res, next) => {
	const { make, model, price, release_date, size, style, transmission_type } =
		req.body;

	try {
		// Check for all required fields
		if (
			!make ||
			!model ||
			!price ||
			!release_date ||
			!size ||
			!style ||
			!transmission_type
		)
			throw new AppError(402, "Bad Request", "Missing required data!");

		// Check for valid data
		if (!carMake.includes(make)) {
			const error = new Error("The entered Make does not exist!");
			error.statusCode = 404;
			throw error;
		}

		if (price < 2000) {
			const error = new Error("Price is too low!");
			error.statusCode = 404;
			throw error;
		}

		if (!carTypes.includes(transmission_type)) {
			const error = new Error("The chosen tranmission type does not exist!");
			error.statusCode = 404;
			throw error;
		}

		if (!carStyles.includes(style)) {
			const error = new Error("The entered style does not exist!");
			error.statusCode = 404;
			throw error;
		}
		// Create the new car
		const newCar = await Car.create(req.body);
		res
			.status(StatusCodes.CREATED)
			.json({ message: "Create Car Successfully", newCar });
	} catch (err) {
		next(err);
	}
};

// Get all cars
const getCars = async (req, res, next) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : 20;
	const filter = req.query.filter ? req.query.filter : {};

	try {
		let skip = (Number(page) - 1) * Number(limit);
		const carList = await Car.find(filter);
		const cars = carList
			.filter(item => item.isDeleted != true)
			.slice(skip, Number(limit) + skip);

		res.status(StatusCodes.OK).json({
			message: "Get Car List Successfully!",
			cars,
			page,
			total: cars.length,
		});
	} catch (err) {
		next(err);
	}
};

// Edit an existing car
const updateCar = async (req, res, next) => {
	const { id: carId } = req.params;

	const { make, model, price, release_date, size, style, transmission_type } =
		req.body;

	// Update option - new: true to return the updated object
	const options = { new: true };

	try {
		const car = await Car.findById(carId);

		// Check for all required fields
		if (
			!carId ||
			!make ||
			!model ||
			!price ||
			!release_date ||
			!size ||
			!style ||
			!transmission_type
		) {
			const error = new Error("Missing required data!");
			error.statusCode = 404;
			throw error;
		}

		// Check if car exists
		if (!car) {
			const error = new Error("Car does not exist!");
			error.statusCode = 500;
			throw error;
		}

		if (car.isDeleted) {
			{
				const error = new Error("Car does not exist!");
				error.statusCode = 500;
				throw error;
			}
		}

		// Check for valid data
		if (!carMake.includes(make)) {
			const error = new Error("The entered brand does not exist!");
			error.statusCode = 404;
			throw error;
		}

		if (price < 2000) {
			const error = new Error("Price is too low!");
			error.statusCode = 404;
			throw error;
		}

		if (!carTypes.includes(transmission_type)) {
			const error = new Error("The chosen tranmission type does not exist!");
			error.statusCode = 404;
			throw error;
		}

		if (!carStyles.includes(style)) {
			const error = new Error("The entered style does not exist!");
			error.statusCode = 404;
			throw error;
		}

		const updatedCar = await Car.findByIdAndUpdate(carId, req.body, options);

		res
			.status(StatusCodes.OK)
			.json({ message: "Update Car Successfully!", updatedCar });
	} catch (err) {
		next(err);
	}
};

// Delete an existing car
const deleteCar = async (req, res, next) => {
	const { id: carId } = req.params;
	const options = { new: true };

	try {
		// Check for required data
		if (!carId) {
			const error = new Error("Missing required data!");
			error.statusCode = 404;
			throw error;
		}

		// Soft delete (only change the isDeleted status) and still keep the car in the database
		const deletedCar = await Car.findByIdAndUpdate(
			carId,
			{ isDeleted: true },
			options
		);

		// Hard delete the car
		// const car = await Car.findOneAndDelete({ _id: carId });
		res
			.status(StatusCodes.OK)
			.json({ message: "Delete Car Successfully!", deletedCar });
	} catch (err) {
		next(err);
	}
};

module.exports = {
	createCar,
	getCars,
	updateCar,
	deleteCar,
};
