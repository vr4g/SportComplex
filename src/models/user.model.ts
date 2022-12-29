import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  role: "admin" | "user";
  enrolledSports: {
    class: string;
    sport: string;
  }[];
  ratings: {
    sport: string;
    rating: number;
  }[];
  comments: {
    sport: string;
    comment: string;
  }[];
  createdAt: Date;
  emailConfirmed: boolean;

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
    },
    enrolledSports: {
      type: [
        {
          _id: false,
          class: {
            type: String,
          },
          sport: {
            type: String,
          },
        },
      ],
    },
    ratings: {
      type: [
        {
          sport: {
            type: String,
            required: false,
          },
          rating: {
            type: Number,
            required: false,
          },
        },
      ],
    },
    comments: {
      type: [
        {
          sport: {
            type: String,
            required: false,
          },
          comment: {
            type: String,
          },
        },
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "users",
  }
);

//compare password
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
