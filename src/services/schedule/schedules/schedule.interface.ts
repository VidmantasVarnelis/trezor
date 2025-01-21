export interface IScheduledTask {
  cronExpression: string;
  executeTask(): void;
}
