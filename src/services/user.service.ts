import prisma from "../db";
import { uploadToCloudinary } from "../helpers/cloudinary";

export interface User {
  id: number;
  email: string;
  password: string;
  profilePicture?: string | null;
  createdAt: Date;
  role: "GUEST" | "VIP";
}

export async function findUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function updateProfilePicture(
  userId: number,
  fileBuffer: Buffer
): Promise<User> {
  const uploadResult = await uploadToCloudinary(fileBuffer);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      profilePicture: uploadResult.secure_url,
    },
  });

  return updatedUser;
}
