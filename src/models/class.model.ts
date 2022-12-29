import mongoose, { Schema } from "mongoose";

export interface ISportClass extends mongoose.Document {
  sport: string;
  age: string;
  usersEnrolled: {
    enrolledUser: string;
    name: string;
  }[];
  schedule: {
    dayInWeek: string;
    time: string;
  }[];
  description: string;
  duration: number;
  ratings: {
    rating: number;
    comment: string;
  }[];
  averageRating: number;
}

const sportClassSchema = new mongoose.Schema(
  {
    sport: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    usersEnrolled: {
      type: [
        {
          _id: false,
          enrolledUser: {
            type: String,
          },
          name: {
            type: String,
          },
        },
      ],
      maxlength: 10,
    },
    ratings: {
      type: [
        {
          rating: {
            type: Number,
            required: false,
          },
          comment: {
            type: String,
            required: false,
          },
        },
      ],
    },
    description: { type: String },
    duration: { type: Number },
    averageRating: { type: Number },
    schedule: {
      type: [
        {
          dayInWeek: {
            type: String,
            required: false,
          },
          time: {
            type: String,
            required: false,
          },
        },
      ],
    },
  },
  {
    collection: "classes",
  }
);

export default mongoose.model<ISportClass>("SportClass", sportClassSchema);
