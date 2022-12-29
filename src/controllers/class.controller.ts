import { Request, Response } from "express";
import SportClass from "../models/class.model";
import User from "../models/user.model";

//
// LEAVE COMMENT AND RATE SPORT CLASS
//
export const rateSport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const sportClass = await SportClass.findById(id);
  if (!sportClass) {
    return res.status(404).send({ message: "Class class not found" });
  }

  sportClass.ratings.push({ rating, comment });
  const ratingsSum = sportClass.ratings.reduce(
    (sum, rating) => sum + rating.rating,
    0
  );
  sportClass.averageRating = ratingsSum / sportClass.ratings.length;

  await sportClass.save();

  res.status(200).send(sportClass);
};

//
// DETAILS OF SELECTED SPORT CLASS
//
export const classDetails = async (req: Request, res: Response) => {
  const classId = req.params.id;

  const sportClass = await SportClass.findById(classId);
  if (!sportClass) {
    return res.status(404).send({ message: "Class not found" });
  }

  res.status(200).send(sportClass);
};

//
// ENROLL AND UN-ENROLL FROM SPORT CLASS
//

export const enrollInSport = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const classId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const sportClass = await SportClass.findById(classId);
  if (!sportClass) {
    return res.status(404).send({ message: "Class not found" });
  }

  if (user.enrolledSports.length === 2) {
    return res
      .status(400)
      .send({ message: "You are already enrolled in two sports" });
  }
  if (sportClass.usersEnrolled.length >= 10) {
    return res.status(400).send({ message: "The class is full" });
  }

  const updateUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        enrolledSports: { class: sportClass._id, sport: sportClass.sport },
      },
    }
  );
  const updatedSport = await SportClass.findOneAndUpdate(
    { _id: classId },
    {
      $set: {
        usersEnrolled: {
          enrolledUser: userId,
          name: `${user.firstname} ${user.lastname}`,
        },
      },
    }
  );

  res.status(200).send({ user: updateUser, sport: updatedSport });
};

export const unEnrollInSport = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const classId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const sportClass = await SportClass.findById(classId);
  if (!sportClass) {
    return res.status(404).send({ message: "Sport not found" });
  }

  sportClass.usersEnrolled = sportClass.usersEnrolled.filter(
    (sportClass) => sportClass.enrolledUser !== userId
  );
  user.enrolledSports = user.enrolledSports.filter(
    (sport) => sport.class !== classId
  );
  await user.save();
  await sportClass.save();

  res.status(200).send(user);
};

//
// filter classes
//
export const filterClasses = async (req: Request, res: Response) => {
  const sports = req.query.sports;
  const age = req.query.age;

  const sportsArray = (sports as string).toLowerCase().split(",");

  const filterSports = await SportClass.find({
    sport: { $in: sportsArray },
    age: age,
  });
  if (!filterSports) {
    return res.status(400).send({ message: "Error fetching classes" });
  }

  res.send(filterSports);
};
