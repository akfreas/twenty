import { useNotes } from '@/activities/notes/hooks/useNotes';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { Note } from '@/activities/types/Note';
import { NoteTarget } from '@/activities/types/NoteTarget';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { WrappedTextEditor } from '@/checklist/WrappedTextEditor';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { OpportunityChecklistDetail } from '@akfreas/vgc-core';
import { useRecoilValue } from 'recoil';
type ChecklistProps = {
  targetableObject: ActivityTargetableObject;
};

export const Checklist = ({ targetableObject }: ChecklistProps) => {
  const currentWorkspace = useRecoilValue(currentWorkspaceState);

  const { createOneRecord: createOneActivityTarget } =
    useCreateOneRecord<NoteTarget>({
      objectNameSingular: CoreObjectNameSingular.NoteTarget,
    });
  const { createOneRecord: createOneActivity } = useCreateOneRecord<Note>({
    objectNameSingular: CoreObjectNameSingular.Note,
  });
  const createNewNote = async () => {
    const newActivity = await createOneActivity({});

    await createOneActivityTarget({
      noteId: newActivity.id,
      opportunityId: targetableObject.id,
    });

    return newActivity.id;
  };
  const { loading: loadingNotes } = useNotes(targetableObject);
  return (
    <div>
      <OpportunityChecklistDetail
        workspaceId={currentWorkspace?.id}
        crmOpportunityId={targetableObject.id}
        createNewNoteAction={createNewNote}
        renderTextEditor={WrappedTextEditor}
        loadingNotes={loadingNotes}
      />
    </div>
  );
};
