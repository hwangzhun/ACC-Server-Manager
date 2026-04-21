export interface SshConfig {
  host: string
  port: number
  username: string
  password?: string
  /** SSH 认证方式，默认 "password" */
  authType?: string
}

export interface ServerProfile {
  name: string
  config: SshConfig
  serverPath?: string
  description?: string
  createdAt: string
}

export interface ServerListItem {
  name: string
  host: string
  port: number
  username: string
  serverPath?: string
  description?: string
  createdAt: string
}