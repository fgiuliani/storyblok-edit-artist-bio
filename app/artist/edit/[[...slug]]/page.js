import { getStoryblokApi } from "@storyblok/react/rsc";
import StoryblokClient from "storyblok-js-client";

import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function Edit({ params }) {
  const slug = params.slug ? params.slug.join("/") : "";

  const { data } = await fetchData(slug);

  return (
    <form
      className="flex min-h-screen flex-col items-center justify-between p-24"
      action={editBio}
    >
      <input type="hidden" id="storyId" name="storyId" value={data.story.id} />
      <input type="hidden" id="slug" name="slug" value={slug} />
      <input
        type="hidden"
        id="name"
        name="name"
        value={data.story.content.name}
      />
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center py-4">
            {data.story.content.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Edit Biography</Label>
              <Textarea
                className="min-h-[200px]"
                defaultValue={data.story.content.bio}
                id="bio"
                name="bio"
              />
            </div>
            <div className="space-x-2">
              <Button className="w-full md:w-auto" type="submit">
                Update Biography
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export async function fetchData(slug) {
  let sbParams = { version: "draft" };

  const storyblokApi = getStoryblokApi();
  return storyblokApi.get(`cdn/stories/artist/${slug}`, sbParams);
}

export async function editBio(formData) {
  "use server";

  const Storyblok = new StoryblokClient({
    oauthToken: "[MANAGEMENT_API_OAUTH_TOKEN]",
  });

  Storyblok.put(`spaces/261958/stories/${formData.get("storyId")}`, {
    story: {
      id: formData.get("storyId"),
      content: {
        component: "artist",
        name: formData.get("name"),
        bio: formData.get("bio"),
      },
    },
    force_update: 1,
    publish: 1,
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });

  revalidatePath(`/artist/${formData.get("slug")}`);
  redirect(`/artist/${formData.get("slug")}`);
}
