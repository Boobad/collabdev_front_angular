// Common API models - align to your backend DTOs as needed

export type ID = number | string

export type Role = "CONTRIBUTEUR" | "ADMINISTRATEUR" | "GESTIONNAIRE"

export interface PageMeta {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface Page<T> {
  content: T[]
  meta?: PageMeta
}

export interface User {
  id: ID
  nom: string
  prenom: string
  email: string
  telephone?: string
  role: Role
  totalCoin?: number
  pointExp?: number
  createdAt?: string
  updatedAt?: string
  actif?: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success?: boolean
  token?: string
  data?: User
  message?: string
}

export interface RegisterRequest {
  nom: string
  prenom: string
  telephone: string
  email: string
  password: string
}

export interface MessageResponse {
  success?: boolean
  message: string
}

export interface Project {
coinsRequired: any
  id: ID
  titre: string
  description: string
  domaine?: string
  secteur?: string
  niveau?: string
  statut?: "OUVERT" | "EN_COURS" | "TERMINE" | "ARCHIVE"
  gestionnaireId?: ID
  createurId?: ID
  technologies?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ProjectCreateRequest {
  titre: string
  description: string
  domaine?: string
  secteur?: string
  roleSoumis?: "IDEATEUR" | "GESTIONNAIRE"
  gestionnaireCandidatId?: ID
  cahierDesChargesFile?: File // optional, handled via FormData
}

export interface Comment {
  id: ID
  auteurId: ID
  projetId?: ID
  contributionId?: ID
  contenu: string
  createdAt: string
  updatedAt?: string
}

export interface Feature {
  id: ID
  projetId: ID
  titre: string
  description?: string
  statut?: "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED"
  assigneeId?: ID
  avancement?: number
  createdAt?: string
  updatedAt?: string
}

export interface FeatureCreateRequest {
  projetId: ID
  titre: string
  description?: string
  assigneeId?: ID
}

export interface Contribution {
  id: ID
  projetId: ID
  auteurId: ID
  description?: string
  lienRepo?: string
  fichierUrl?: string
  statut: "SOUMISE" | "VALIDEE" | "REJETEE"
  recompenseCoin?: number
  createdAt?: string
}

export interface ContributionSubmitRequest {
  description?: string
  lienRepo?: string
  fichier?: File
}

export interface ParticipationRequest {
  id: ID
  projetId: ID
  candidatId: ID
  motivation?: string
  scoreQuiz?: number
  statut: "EN_ATTENTE" | "VALIDE" | "REJETE"
  createdAt?: string
}

export interface Badge {
  id: ID
  nom: string
  description?: string
  seuil?: number
  type?: string
  icon?: string
  actif?: boolean
}

export interface UserBadge {
  id: ID
  badgeId: ID
  userId: ID
  acquiredAt: string
  progress?: number
}

export interface CoinConfig {
  id?: ID
  eventValues: Record<string, number>
  updatedAt?: string
}

export interface CoinTransaction {
  id: ID
  userId: ID
  type: "GAIN" | "DEPENSE"
  motif: string
  montant: number
  createdAt: string
}

export interface Notification {
  id: ID
  sujet: string
  contenu: string
  lu: boolean
  createdAt: string
}

export interface Question {
  id?: ID
  intitule: string
  type: "QCM" | "QCU" | "TEXTE" | "CODE"
  options?: string[]
  reponseCorrecte?: string | string[]
  score?: number
}

export interface Quiz {
  id: ID
  titre: string
  description?: string
  questions: Question[]
  template?: boolean
}

export interface QuizCreateRequest {
  titre: string
  description?: string
  questions: Question[]
  templateId?: ID
}

export interface QuizAnswer {
  questionId: ID
  reponse: string | string[]
}

export interface QuizSubmitRequest {
  motivation?: string
  reponses: QuizAnswer[]
  timerSeconds?: number
}

export interface TemplateProject {
  id: ID
  nom: string
  description?: string
  structure?: Record<string, any>
  questionnaires?: ID[]
  params?: Record<string, any>
  createdAt?: string
}

export interface BulkValidationRequest {
  ids: ID[]
  action: "VALIDER" | "REJETER"
}

export interface PasswordResetRequest {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface AdminStats {
  totalUsers: number
  totalProjects: number
  totalContributions: number
  totalCoins: number
  recentActivity: { type: string; message: string; date: string }[]
}
