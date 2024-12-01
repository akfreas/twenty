import { RichTextEditor } from '@/activities/components/RichTextEditor';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';

export const WrappedTextEditor = ({
  activityId,
  loadingNotes,
}: {
  activityId: string;
  loadingNotes: boolean;
}) => {
  if (loadingNotes) {
    return <div>Loading...</div>;
  }
  return (
    <RichTextEditor
      activityId={activityId}
      fillTitleFromBody={false}
      activityObjectNameSingular={CoreObjectNameSingular.Note}
    />
  );
};
