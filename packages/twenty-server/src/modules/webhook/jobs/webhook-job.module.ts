import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CallVGCJob } from 'src/engine/api/graphql/workspace-query-runner/jobs/call-vgc-job';
import { AnalyticsModule } from 'src/engine/core-modules/analytics/analytics.module';
import { CallWebhookJobsJob } from 'src/modules/webhook/jobs/call-webhook-jobs.job';
import { CallWebhookJob } from 'src/modules/webhook/jobs/call-webhook.job';

@Module({
  imports: [HttpModule, AnalyticsModule],
  providers: [CallWebhookJobsJob, CallWebhookJob, CallVGCJob],
})
export class WebhookJobModule {}
