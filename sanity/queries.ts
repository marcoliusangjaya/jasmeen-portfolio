import { groq } from "next-sanity";

export const projectsQuery = groq`
  *[_type == "project"] | order(orderRank) {
    _id,
    title,
    "slug": slug.current,
    category,
    location,
    date,
    "coverImage": thumbnailImage.asset->url
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    location,
    date,
    description,
    "coverImage": thumbnailImage.asset->url,
    heroLayout,
    "heroImages": heroImages[].asset->url,
    "contentSections": contentSections[] {
      layout,
      "images": images[].asset->url
    },
    sectionLabel,
    sectionDescription,
    "otherWork": otherWork[]-> {
      _id,
      title,
      "slug": slug.current,
      category,
      location,
      "coverImage": thumbnailImage.asset->url
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
