import { groq } from "next-sanity";

export const projectsQuery = groq`
  *[_type == "project"] | order(orderRank) {
    _id,
    title,
    "slug": slug.current,
    "categories": coalesce(categories, array::compact([category])),
    location,
    date,
    "coverImage": thumbnailImage.asset->url,
    "coverVideo": coverVideo.asset->url,
    thumbnailSize
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "categories": coalesce(categories, array::compact([category])),
    location,
    date,
    subheading,
    description,
    "coverImage": thumbnailImage.asset->url,
    "coverVideo": coverVideo.asset->url,
    heroLayout,
    "heroImages": heroImages[] {
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    "sections": sections[] {
      layout,
      "items": items[] {
        "image": image.asset->url,
        label
      }
    },
    "mockupRows": mockupRows[] {
      "items": select(
        defined(items) => items[] {
          "url": image.asset->url,
          "width": image.asset->metadata.dimensions.width,
          "height": image.asset->metadata.dimensions.height,
          "videoUrl": video.asset->url
        },
        images[] {
          "url": asset->url,
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height
        }
      )
    },
    "otherWork": otherWork[]-> {
      _id,
      title,
      "slug": slug.current,
      "categories": coalesce(categories, array::compact([category])),
      location,
      "coverImage": thumbnailImage.asset->url,
      "coverVideo": coverVideo.asset->url
    }
  }
`;

export const aboutQuery = groq`
  *[_type == "about"][0] {
    name,
    bio,
    "polaroidPhoto": polaroidPhoto.asset->url,
    credentials[] {
      degree,
      school
    },
    skills,
    email,
    resumeUrl,
    socialLinks[] {
      platform,
      url
    }
  }
`;

export const footerQuery = groq`
  *[_type == "about"][0] {
    socialLinks[] {
      platform,
      url
    }
  }
`;
