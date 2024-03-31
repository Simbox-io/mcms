import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CourseCategory, CourseTag, Course, Lesson, Enrollment, Quiz, QuizQuestion, Assignment, Announcement } from '@/lib/prisma';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
    try {
        // Generate sample data using Faker.js
        const sampleData = await generateSampleData();

        // Insert the sample data into the database
        await prisma.courseCategory.createMany({ data: sampleData.categories as CourseCategory[] });
        await prisma.tag.createMany({ data: sampleData.tags as CourseTag[] });
        await prisma.course.createMany({ data: sampleData.courses as Course[] });
        await prisma.lesson.createMany({ data: sampleData.lessons as Lesson[] });
        await prisma.enrollment.createMany({ data: sampleData.enrollments as Enrollment[] });
        await prisma.quiz.createMany({ data: sampleData.quizzes as Quiz[] });
        await prisma.quizQuestion.createMany({ data: sampleData.quizQuestions as QuizQuestion[] });
        await prisma.assignment.createMany({ data: sampleData.assignments as Assignment[] });
        await prisma.announcement.createMany({ data: sampleData.announcements as Announcement[] });

        return NextResponse.json({ message: 'Sample data inserted successfully' });
    } catch (error) {
        console.error('Failed to insert sample data', error);
        return NextResponse.json({ error: 'Failed to insert sample data' }, { status: 500 });
    }
}

async function generateSampleData() {
    const users = await prisma.user.findMany();
    const categories = [];
    const tags = [];
    const courses = [];
    const lessons = [];
    const enrollments = [];
    const quizzes = [];
    const quizQuestions = [];
    const assignments = [];
    const announcements = [];

    // Generate sample categories and tags
    for (let i = 0; i < 5; i++) {
        categories.push({
            id: uuidv4(),
            name: faker.lorem.word(),
        });
        tags.push({
            id: uuidv4(),
            name: faker.lorem.word(),
        });
    }

    // Generate sample courses
    for (let i = 0; i < 10; i++) {
        const courseId = uuidv4();
        courses.push({
            id: courseId,
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            image: faker.image.url(),
            instructorId: users[0].id,
        });

        // Generate sample lessons for each course
        for (let j = 0; j < 5; j++) {
            const lessonId = uuidv4();
            lessons.push({
                id: lessonId,
                title: faker.lorem.sentence(),
                description: faker.lorem.paragraph(),
                content: faker.lorem.paragraphs(3),
                duration: faker.number.int({ min: 5, max: 60 }),
                published: true,
                videoUrl: faker.internet.url(),
                courseId: courseId,
                updatedAt: new Date(),
            });

            // Generate sample assignments for each lesson
            assignments.push({
                id: uuidv4(),
                title: faker.lorem.sentence(),
                description: faker.lorem.paragraph(),
                dueDate: faker.date.future(),
                lessonId: lessonId,
            });
            
            // Generate sample quizzes for each lesson
            for (let k = 0; k < 2; k++) {
                const quizId = uuidv4();
                quizzes.push({
                    id: quizId,
                    title: faker.lorem.sentence(),
                    description: faker.lorem.paragraph(),
                    lessonId: lessonId,
                });

                // Generate sample quiz questions for each quiz
                for (let l = 0; l < 5; l++) {
                    quizQuestions.push({
                        id: uuidv4(),
                        question: faker.lorem.sentence().replace('.', '?'),
                        choices: faker.lorem.words(4).split(' '),
                        correctAnswer: faker.lorem.word(),
                        quizId: quizId,
                    });
                }
            }
        }

        // Generate sample enrollments for each course
        for (let j = 0; j < 5; j++) {
            enrollments.push({
                id: uuidv4(),
                studentId: users[0].id,
                courseId: courseId,
                progress: faker.number.int({ min: 0, max: 100 }),
            });
        }

        // Generate sample announcements for each course
        for (let j = 0; j < 3; j++) {
            announcements.push({
                id: uuidv4(),
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                courseId: courseId,
            });
        }
    }

    return {
        categories,
        tags,
        courses,
        lessons,
        enrollments,
        quizzes,
        quizQuestions,
        assignments,
        announcements,
    };
}