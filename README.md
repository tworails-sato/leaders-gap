# リーダーズGAP診断

経営層と事業責任者の認識差を可視化し、権限移譲の論点を整理する診断アプリです。

## セットアップ

1. Supabase プロジェクトを作成します。
2. `supabase/schema.sql` を Supabase SQL Editor で実行します。
3. `.env.example` を `.env.local` にコピーし、Supabase URL / anon key / service role key を設定します。
4. Supabase Auth でメール + パスワードログインを有効化します。
5. 初期管理者を Supabase Auth で作成し、SQL Editor で `admin_profiles` に追加します。

```sql
insert into admin_profiles (id, email, name, role)
values ('AUTH_USER_ID', 'admin@example.com', '管理者', 'admin');
```

## 開発

```bash
npm install
npm run dev
```

## 主なルート

- `/`
- `/respond/[token]` 回答者専用URL。受検者ログインは不要です。
- `/thanks`
- `/expired`
- `/used`
- `/login`
- `/admin`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[project_id]`
- `/admin/projects/[project_id]/report`

## 設問定義

`lib/questions.ts` に48問とテーマ定義があります。

## 受検者側の導線

受検者は公開トップやログイン画面から受検しません。管理者が案件詳細で発行した `/respond/[token]` の専用URLからのみ受検します。

`/respond/[token]` では、最初に受検案内画面を表示し、「診断を開始する」ボタンの後に回答者情報の確認・入力画面、続いて48問の回答画面へ進みます。回答完了後は本人に結果を表示せず、完了画面のみ表示します。
"# leaders-gap"  
