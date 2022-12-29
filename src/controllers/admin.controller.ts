import { Request, Response } from "express";
import User from "../models/user.model";
import SportClass from "../models/class.model";

//
//manage users
//
export const showAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  if (!users) {
    return res.status(404).send({ message: "Users not found" });
  }
  res.send(users);
};

export const manageUser = async (req: Request, res: Response) => {
  const { firstname, lastname, role } = req.body;
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    { $set: { firstname: firstname, lastname: lastname, role: role } },
    { new: true }
  );
  user.save();

  res.send(updatedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  await User.deleteOne({ _id: userId });

  res.status(200).send({ message: "User deleted successfully" });
};

//
//manage classes
//

export const createClass = async (req: Request, res: Response) => {
  const { age, sport, schedule, description, duration } = req.body;

  if (!age || !sport || !schedule || !description || !duration) {
    return res.status(400).send({ message: "Form not complete" });
  }

  const sportClass = new SportClass({
    sport: sport,
    age: age,
    usersEnrolled: [],
    ratings: [],
    description: description,
    schedule: [
      {
        dayInWeek: schedule[0].dayInWeek,
        time: schedule[0].time,
      },
      {
        dayInWeek: schedule[1].dayInWeek,
        time: schedule[1].time,
      },
      { dayInWeek: schedule[2].dayInWeek, time: schedule[2].time },
    ],
    averageRating: 0,
    duration: duration,
  });

  sportClass.save();

  res.send(sportClass);
};

export const viewClasses = async (req: Request, res: Response) => {
  const sportClass = await SportClass.find();
  if (!sportClass) {
    return res.status(404).send({ message: "Classes not found" });
  }

  res.send(sportClass);
};

export const editClass = async (req: Request, res: Response) => {
  const classId = req.params.id;
  const { age, sport, schedule, description, duration } = req.body;

  if (!age || !sport || !schedule || !description || !duration) {
    return res.status(400).send({ message: "Form not complete" });
  }

  const editedClass = await SportClass.findByIdAndUpdate(
    { _id: classId },
    {
      sport: sport,
      age: age,
      description: description,
      schedule: [
        {
          dayInWeek: schedule[0].dayInWeek,
          time: schedule[0].time,
        },
        {
          dayInWeek: schedule[1].dayInWeek,
          time: schedule[1].time,
        },
        { dayInWeek: schedule[2].dayInWeek, time: schedule[2].time },
      ],
      duration: duration,
    },
    { new: true }
  );

  res.send(editedClass);
};

export const deleteClass = async (req: Request, res: Response) => {
  const classId = req.params.id;

  const sportClass = await SportClass.findById(classId);
  if (!sportClass) {
    return res.status(404).send({ message: "Class not found" });
  }
  await SportClass.deleteOne({ _id: classId });

  res.status(200).send({ message: "Class deleted successfully" });
};

//
// show Rates and Comments
//

export const showRatesAndComments = async (req: Request, res: Response) => {
  const classId = req.params.id;

  const sportClass = await SportClass.findById(classId);
  if (!sportClass) {
    return res.status(404).send({ message: "Class not found" });
  }

  res.send({
    ratingsAndComments: sportClass.ratings,
    averageRating: sportClass.averageRating,
  });
};
