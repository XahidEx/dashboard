import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// This is a tRPC router used to manage API calls to the Student table
export const studentRouter = createTRPCRouter({
  // CREATE: Creates a new student entry in the database
  createStudent: protectedProcedure
    // Takes in an input object that is validated using zod
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        studentId: z
          .string()
          .min(1)
          .max(8, "Student ID must be 8 characters max"),
        studentCardId: z.string().min(1),
      }),
    )
    // This mutation function takes in the input object and creates a new entry in the database
    .mutation(async ({ ctx, input }) => {
      return ctx.db.student.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          studentId: input.studentId,
          studentCardId: input.studentCardId,
        },
      });
    }),

  // GET: Gets all rows and columns from the student table
  getAllStudents: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.student.findMany();
  }),

  // GET: Gets a specific student entry by its ID (primary key)
  getStudentById: protectedProcedure
    .input(z.string().min(1).max(8))
    .query(async (props) => {
      return props.ctx.db.student.findFirst({
        where: {
          studentCardId: props.input,
        },
      });
    }),

  // GET: Gets the number of student entries
  getStudentCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.student.count();
  }),

  // GET: Gets all student IDs from the student table
  getAllStudentIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.student.findMany({
      select: {
        studentId: true,
      },
    });
  }),

  // DELETE: Deletes a student entry by its ID (primary key)
  deleteStudentById: protectedProcedure
    // Takes in an input object that is validated using zod
    .input(
      z.object({
        studentId: z.string().min(1),
        firstName: z.string().min(1).optional(),
      }),
    )
    // This mutation function takes in the input object and deletes the entry in the database
    .mutation(async ({ ctx, input }) => {
      return ctx.db.student.delete({
        where: {
          studentId: input.studentId,
        },
      });
    }),
});
