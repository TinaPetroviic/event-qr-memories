// Minimal hand-written types describing the Supabase schema used by this app.
// Kept in sync with supabase/migrations/0001_init.sql
//
// NOTE: these must be `type` aliases (not `interface`s). TypeScript only
// treats a plain type literal as satisfying `Record<string, unknown>` in a
// conditional-type check - interfaces don't, which breaks the supabase-js
// generic Database inference (Schema silently resolves to `never`).

export type EventRow = {
  id: string;
  owner_id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string; // ISO date (YYYY-MM-DD)
  slug: string;
  welcome_message: string;
  gallery_public: boolean;
  qr_design: "classic" | "modern" | "romantic" | "rustic";
  created_at: string;
};

export type PhotoRow = {
  id: string;
  event_id: string;
  storage_path: string;
  guest_name: string | null;
  media_type: "photo" | "video" | "audio";
  created_at: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13";
  };
  public: {
    Tables: {
      events: {
        Row: EventRow;
        Insert: Partial<EventRow> &
          Pick<EventRow, "bride_name" | "groom_name" | "wedding_date" | "slug" | "owner_id">;
        Update: Partial<EventRow>;
        Relationships: [];
      };
      photos: {
        Row: PhotoRow;
        Insert: Partial<PhotoRow> & Pick<PhotoRow, "event_id" | "storage_path">;
        Update: Partial<PhotoRow>;
        Relationships: [
          {
            foreignKeyName: "photos_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
