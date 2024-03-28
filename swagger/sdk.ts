/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface StreamUser {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
  banned: boolean;
  online: boolean;
  name: string;
  email: string;
}

export interface SyncStreamTokenResponse {
  token: string;
  user: StreamUser;
}

export interface StreamChannelItem {
  id: string;
  type: string;
  cid: string;
  memberCount: number;
  name: string;
}

export interface GetChannelsResponse {
  channels: StreamChannelItem[];
}

export interface AddMemberDto {
  userId: string;
}

export interface SendMessageAs {
  userId: string;
  message: string;
}

export interface LanguageItem {
  id: string;
  name: string;
}

export interface GetLanguagesResponseDto {
  data: LanguageItem[];
  total: number;
}

export enum UserGender {
  Male = "Male",
  Female = "Female",
  Unknown = "Unknown",
}

export enum UserLanguageType {
  Fluent = "Fluent",
  Learning = "Learning",
}

export interface UserLanguageDto {
  id: string;
  name: string;
  proficiency: number;
  type: UserLanguageType;
}

export interface UserPreferenceDto {
  partnerDescription: string;
  locationRange: number;
  ageRangeMin: number;
  ageRangeMax: number;
}

export interface UserTopicDto {
  id: string;
  name: string;
}

export interface GetUserResponseDto {
  id: string;
  name: string;
  email: string;
  photo: string;
  phoneNumber: string;
  introduction: string;
  dateOfBirth: string;
  gender: UserGender;
  languages: UserLanguageDto[];
  preference: UserPreferenceDto | null;
  topics: UserTopicDto[];
}

export interface UpdateUserInfoDto {
  name: string;
  photo: string;
  introduction: string;
  dateOfBirth: string;
  gender: UserGender;
}

export interface OnboardUserLanguageDto {
  id: string;
  proficiency: number;
  type: UserLanguageType;
}

export interface OnboardUserTopicDto {
  id: string;
}

export interface OnboardUserDto {
  name: string;
  photo: string;
  introduction: string;
  dateOfBirth: string;
  gender: UserGender;
  languages: OnboardUserLanguageDto[];
  preference: UserPreferenceDto;
  topics: OnboardUserTopicDto[];
}

export interface UpsertTopicsDto {
  topicIds: string[];
}

export interface UpsertUserLanguageDto {
  languageId: string;
  proficiency: number;
  type: UserLanguageType;
}

export interface DeleteUserLanguagesDto {
  languageIds: string[];
}

export interface UpdateUserPreferenceDto {
  partnerDescription: string;
  locationRange: number;
  ageRangeMin: number;
  ageRangeMax: number;
}

import type { AxiosInstance, AxiosRequestConfig, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then(response => response.data);
  };
}

/**
 * @title Greet App API
 * @version 1.0.0
 * @contact
 *
 * Powered by Greet
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @name AppControllerGetHello
     * @request GET:/api
     */
    appControllerGetHello: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name AppControllerGetProtected
     * @request GET:/api/protected
     */
    appControllerGetProtected: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/protected`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags stream
     * @name StreamControllerSyncToken
     * @request GET:/api/stream/sync-token
     * @secure
     */
    streamControllerSyncToken: (params: RequestParams = {}) =>
      this.request<SyncStreamTokenResponse, any>({
        path: `/api/stream/sync-token`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags stream
     * @name StreamControllerGetUsers
     * @request GET:/api/stream/users
     * @secure
     */
    streamControllerGetUsers: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/stream/users`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags stream
     * @name StreamControllerGetChannels
     * @request GET:/api/stream/channels
     * @secure
     */
    streamControllerGetChannels: (params: RequestParams = {}) =>
      this.request<GetChannelsResponse, any>({
        path: `/api/stream/channels`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags stream
     * @name StreamControllerCreateChannel
     * @request POST:/api/stream/channel
     * @secure
     */
    streamControllerCreateChannel: (
      data: {
        id?: string;
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/stream/channel`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags stream
     * @name StreamControllerGetCurrentChannel
     * @request GET:/api/stream/channel/{channelId}
     * @secure
     */
    streamControllerGetCurrentChannel: (channelId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/stream/channel/${channelId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags stream
     * @name StreamControllerGetChannelMembers
     * @request GET:/api/stream/channel/{channelId}/members
     * @secure
     */
    streamControllerGetChannelMembers: (channelId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/stream/channel/${channelId}/members`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags stream
     * @name StreamControllerAddMember
     * @request POST:/api/stream/channel/{channelId}/members
     * @secure
     */
    streamControllerAddMember: (channelId: string, data: AddMemberDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/stream/channel/${channelId}/members`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags stream
     * @name StreamControllerSendMessageAs
     * @request POST:/api/stream/channel/{channelId}/messages
     * @secure
     */
    streamControllerSendMessageAs: (channelId: string, data: SendMessageAs, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/stream/channel/${channelId}/messages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags stream
     * @name StreamControllerGetMessages
     * @request GET:/api/stream/channel/{channelId}/messages
     * @secure
     */
    streamControllerGetMessages: (channelId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/stream/channel/${channelId}/messages`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags langs
     * @name LangsControllerGetLangs
     * @request GET:/api/langs
     */
    langsControllerGetLangs: (
      query: {
        /** @default 0 */
        skip?: number;
        /** @default 10 */
        take?: number;
        search: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetLanguagesResponseDto, any>({
        path: `/api/langs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags langs
     * @name LangsControllerGetLangById
     * @request GET:/api/langs/{id}
     */
    langsControllerGetLangById: (id: string, params: RequestParams = {}) =>
      this.request<LanguageItem, any>({
        path: `/api/langs/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerGetUserInfo
     * @request GET:/api/users
     * @secure
     */
    usersControllerGetUserInfo: (params: RequestParams = {}) =>
      this.request<GetUserResponseDto, any>({
        path: `/api/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerUpdateGeneralInfo
     * @request PUT:/api/users
     * @secure
     */
    usersControllerUpdateGeneralInfo: (data: UpdateUserInfoDto, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/users`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerOnboardUser
     * @request POST:/api/users/onboard
     * @secure
     */
    usersControllerOnboardUser: (data: OnboardUserDto, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/users/onboard`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerAddUserTopics
     * @request POST:/api/users/topics
     * @secure
     */
    usersControllerAddUserTopics: (data: UpsertTopicsDto, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/users/topics`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerDeleteUserTopics
     * @request DELETE:/api/users/topics
     * @secure
     */
    usersControllerDeleteUserTopics: (data: UpsertTopicsDto, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/users/topics`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerUpsertUserLanguages
     * @request POST:/api/users/languages
     * @secure
     */
    usersControllerUpsertUserLanguages: (data: UpsertUserLanguageDto, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/users/languages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerDeleteUserLanguages
     * @request DELETE:/api/users/languages
     * @secure
     */
    usersControllerDeleteUserLanguages: (data: DeleteUserLanguagesDto, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/users/languages`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerUpdateUserPreference
     * @request POST:/api/users/preferences
     * @secure
     */
    usersControllerUpdateUserPreference: (data: UpdateUserPreferenceDto, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/users/preferences`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags recommendations
     * @name RecommendationsControllerGetRecommendations
     * @request GET:/api/recommendations/{userId}
     */
    recommendationsControllerGetRecommendations: (
      userId: string,
      query?: {
        /** @default 0 */
        skip?: number;
        /** @default 10 */
        take?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/recommendations/${userId}`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
}
