import { getStoryblokApi } from "@storyblok/react/rsc";

import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home({ params }) {
  const slug = params.slug ? params.slug.join("/") : "";

  const { data } = await fetchData(slug);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center py-4">
            {data.story.content.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Biography</h2>
            <div className="overflow-hidden">
              <p>{data.story.content.bio}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button className="w-full md:w-auto" variant="outline" asChild>
              <Link href={"/artist/edit/" + slug}>Edit</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export async function fetchData(slug) {
  let sbParams = { version: "draft" };

  const storyblokApi = getStoryblokApi();
  return storyblokApi.get(`cdn/stories/artist/${slug}`, sbParams);
}
