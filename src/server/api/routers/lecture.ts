import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const lectureRouter = createTRPCRouter({
  getAllLectures: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.findMany();
  }),

  getAllLecturesWithModuleNames: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.findMany({
      include: {
        Module: {
          select: {
            moduleName: true,
          },
        },
      },
    });
  }),

  getLectureCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.count();
  }),

  getAllLectureIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.findMany({
      select: {
        lectureId: true,
      },
    });
  }),

  getLectureIdsWithModuleNames: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.findMany({
      select: {
        lectureId: true,
        Module: {
          select: {
            moduleName: true,
          },
        },
      },
    });
  }),

  createNewLecture: protectedProcedure
    .input(
      z.object({
        lectureId: z.string(),
        startTime: z.date(),
        endTime: z.date(),
        moduleId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newLectureRecord = await ctx.prisma.lecture.create({
          data: {
            lectureId: input.lectureId,
            startTime: input.startTime,
            endTime: input.endTime,
            moduleId: input.moduleId,
          },
        });

        return newLectureRecord;
      } catch (error) {
        console.error("Error creating attendance record:", error);

        throw new Error("Failed to create attendance record");
      }
    }),

  deleteLectureRecordById: protectedProcedure
    .input(
      z.object({
        lectureId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.lecture.delete({
        where: {
          lectureId: input.lectureId,
        },
      });
    }),
});
