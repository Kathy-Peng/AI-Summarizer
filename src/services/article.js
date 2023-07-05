import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const rapidapikey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;

export const articleApi = createApi({
    reducerPath: 'articleApi', 
    baseQuery: fetchBaseQuery({baseUrl:'https://article-extractor-and-summarizer.p.rapidapi.com/', 
    prepareHeaders: (headers)=>{
        headers.set('X-RapidAPI-Key', rapidapikey );
        headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com');
        return headers;
    } 
    }),
    endpoints: (builder) => ({
        getSummary : builder.query({ //wrap user-generated url content with encodeURIComponenet to ensure consistency
            query: (params) => `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=5`
        })
    })

    })
    //difference between useGetSummaryQuery and useLazyGetSummaryQuery: don't fire immediately as the app starts but fire on demand
    export const { useLazyGetSummaryQuery } = articleApi;