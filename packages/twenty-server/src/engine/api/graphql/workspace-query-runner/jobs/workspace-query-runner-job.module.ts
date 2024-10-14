import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CallVGCJob } from 'src/engine/api/graphql/workspace-query-runner/jobs/call-vgc-job';
import { CallWebhookJobsJob } from 'src/engine/api/graphql/workspace-query-runner/jobs/call-webhook-jobs.job';
import { CallWebhookJob } from 'src/engine/api/graphql/workspace-query-runner/jobs/call-webhook.job';
import { RecordPositionBackfillJob } from 'src/engine/api/graphql/workspace-query-runner/jobs/record-position-backfill.job';
import { RecordPositionBackfillModule } from 'src/engine/api/graphql/workspace-query-runner/services/record-position-backfill-module';
import { DataSourceModule } from 'src/engine/metadata-modules/data-source/data-source.module';
import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';

@Module({
  imports: [
    WorkspaceDataSourceModule,
    DataSourceModule,
    RecordPositionBackfillModule,
    HttpModule,
  ],
  providers: [
    CallWebhookJobsJob,
    CallWebhookJob,
    RecordPositionBackfillJob,
    CallVGCJob,
  ],
})
export class WorkspaceQueryRunnerJobModule {}
