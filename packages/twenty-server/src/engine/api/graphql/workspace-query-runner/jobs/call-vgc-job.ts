import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';

import { CallWebhookJobsJobData } from 'src/engine/api/graphql/workspace-query-runner/jobs/call-webhook-jobs.job';
import { Process } from 'src/engine/integrations/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/integrations/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/integrations/message-queue/message-queue.constants';

@Processor(MessageQueue.vgcQueue)
export class CallVGCJob {
  private readonly logger = new Logger(CallVGCJob.name);
  private readonly vcgTargetUrl = process.env.VGC_WEBHOOK_URL;
  constructor(private readonly httpService: HttpService) {
    console.log('CallVGCJob', this.vcgTargetUrl);
  }

  @Process(CallVGCJob.name)
  async handle(data: CallWebhookJobsJobData): Promise<void> {
    const nameSingular = data.objectMetadataItem.nameSingular;
    const operation = data.operation;
    const eventType = `${operation}.${nameSingular}`;
    const payload = {
      eventType,
      objectMetadata: {
        id: data.objectMetadataItem.id,
        nameSingular: data.objectMetadataItem.nameSingular,
      },
      workspaceId: data.workspaceId,
      eventDate: new Date(),
      record: data.record,
    };

    console.log('CallVGCJob', JSON.stringify(payload));
    if (!this.vcgTargetUrl) {
      throw new Error('VGC_WEBHOOK_URL is not defined');
    }
    try {
      await this.httpService.axiosRef.post(this.vcgTargetUrl, payload);
      this.logger.log(
        `CallVGCJob successfully called on targetUrl '${this.vcgTargetUrl}'`,
      );
    } catch (err) {
      this.logger.error(
        `Error calling webhook on targetUrl '${this.vcgTargetUrl}': ${err}`,
      );
    }
  }
}
