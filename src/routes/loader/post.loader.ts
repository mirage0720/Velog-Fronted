import { LoaderFunctionArgs } from "react-router";
import { axioisInstance } from "../../api/axios";
import { requireAuth } from "./auth.loader";

export const fetchOverview = async () => {
  try {
    const { data } = await axioisInstance.get("/posts/overview");
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const fetchPostDetail = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { data } = await axioisInstance.get(`/posts/${params.id}`);
    const {
      data: { posts: relatedPosts },
    } = await axioisInstance.get(`/posts?category=${data.category}&limit=3`);
    return { post: data, relatedPosts };
  } catch {
    return { post: null, relatedPosts: null };
  }
};

export const fetchPostModify = async ({ params }: LoaderFunctionArgs) => {
  try {
    const auth = requireAuth();
    if (auth) return auth;
    const { data } = await axioisInstance.get(`/posts/${params.id}`);
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const fetchPosts = async ({ request }: LoaderFunctionArgs) => {
  try {
    let query = "";
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") ?? "newest"; // views
    const category = url.searchParams.get("category") ?? "";
    const page = url.searchParams.get("page") ?? "1";
    const search = url.searchParams.get("search") ?? "";

    if (sort !== "") query += `sort=${sort}`;
    if (category !== "") query += `&category=${category}`;
    if (page !== "") query += `&page=${page}`;
    if (search !== "") query += `&search=${search}`;

    const { data } = await axioisInstance.get(`/posts?${query}`);
    return data;
  } catch (e) {
    console.error(e);
  }
};
