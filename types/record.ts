export interface ClinicalRecord {
  id: string
  patientId: string
  patientName: string
  content: string
  sections: RecordSection[]
  audit: AuditEntry[]
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
  status: "active" | "archived" | "locked"
}

export interface RecordSection {
  id: string
  title: string
  content: string
  type: SectionType
  order: number
  lastModified: string
  modifiedBy: string
  isEditing?: boolean
  hasUnsavedChanges?: boolean
}

export type SectionType = "diagnosis" | "treatment" | "notes" | "evaluation" | "plan" | "history"

export interface AuditEntry {
  id: string
  user: string
  userId: string
  action: AuditAction
  section?: string
  sectionId?: string
  changes: FieldChange[]
  date: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

export type AuditAction = "create" | "edit" | "delete" | "view" | "archive" | "restore"

export interface FieldChange {
  field: string
  oldValue: string
  newValue: string
}

export interface UpdateSectionRequest {
  content: string
  sectionId: string
}

export interface CreateRecordRequest {
  patientId: string
  content: string
  sections: Omit<RecordSection, "id" | "lastModified" | "modifiedBy">[]
}
