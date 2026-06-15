"use client";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  return (
    <form
      action="/api/projects/delete"
      method="post"
      onSubmit={(event) => {
        if (!window.confirm("この案件と紐づく招待・回答・FBレポートを削除します。よろしいですか？")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="project_id" value={projectId} />
      <button className="danger" type="submit">削除</button>
    </form>
  );
}
