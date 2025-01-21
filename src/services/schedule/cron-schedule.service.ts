import { logger } from '@repo/logger';
import cron from 'node-cron';
import { IScheduledTask } from './schedules';

export class CronScheduleService {
  private readonly tasks: cron.ScheduledTask[];

  constructor(private readonly predefinedTasks: IScheduledTask[] = []) {
    this.tasks = this.predefinedTasks.map((task) =>
      cron.schedule(task.cronExpression, task.executeTask.bind(task), { scheduled: false }),
    );
  }

  addTask(cronExpression: string, task: (now: Date | 'manual' | 'init') => void) {
    const scheduledTask = cron.schedule(cronExpression, task);
    this.tasks.push(scheduledTask);
  }

  stop() {
    this.tasks.forEach((task) => task.stop());
    logger.debug('Cron services stopped.');
  }

  start() {
    this.tasks.forEach((task) => task.start());
    logger.debug('Cron services started.');
  }
}
