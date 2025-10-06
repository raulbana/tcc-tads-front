export type ExerciseStatus = 'COMPLETED' | 'PENDING' | 'IN_PROGRESS';

export interface Exercise {
    id: string;
    title: string;
    description: string;
    status: ExerciseStatus;
    createdAt: Date;
    updatedAt: Date;
    duration: string;
    repetitions: number;
    sets: number;
    dueDate?: Date;
    category: string;
    completedAt?: Date;
}