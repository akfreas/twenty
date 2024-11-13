import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { CallWebhookJobData } from 'src/modules/webhook/jobs/call-webhook.job';

@Processor(MessageQueue.vgcQueue)
export class CallVGCJob {
  private readonly logger = new Logger(CallVGCJob.name);
  private readonly vcgTargetUrl = process.env.VGC_WEBHOOK_URL;
  constructor(private readonly httpService: HttpService) {
    console.log('CallVGCJob', this.vcgTargetUrl);
  }

  @Process(CallVGCJob.name)
  async handle(data: CallWebhookJobData): Promise<void> {
    const eventType = data.eventName;
    const payload = {
      eventType,
      objectMetadata: {
        id: data.objectMetadata.id,
        nameSingular: data.objectMetadata.nameSingular,
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
