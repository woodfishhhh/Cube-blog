import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MobileHome } from "@/components/home/MobileHome";
import type { HomePageData } from "@/lib/content/types";

const mobileHomeData: HomePageData = {
  hero: {
    eyebrow: "WOODFISH mobile",
    title: "Notes without choreography",
    summary: "A direct mobile shell that keeps reading and author context one tap away.",
  },
  posts: [
    {
      slug: "mobile-shell-post",
      title: "Mobile Shell Post",
      publishedAt: "2026-03-21 12:00:00",
      publishedLabel: "Mar 21, 2026",
      tags: ["Mobile"],
      categories: ["Notes"],
      excerpt: "A launch note used to verify direct post access on mobile.",
    },
  ],
  author: {
    displayName: "WOODFISH",
    introduction: "Writes careful notes about web systems and quiet interfaces.",
    headline: "Builder and writer",
    slogan: "Readable before theatrical.",
    location: "China",
    occupation: "Student",
    university: "Example University",
    major: "Computer Science",
    profileTags: ["Minimal", "Curated"],
    focusAreas: ["Frontend", "Three.js"],
  },
};

describe("MobileHome", () => {
  it("renders a content-first mobile shell with explicit blog and author jump links", () => {
    render(<MobileHome data={mobileHomeData} />);

    const main = screen.getByRole("main", {
      name: /mobile homepage editorial shell/i,
    });
    const sectionNav = within(main).getByRole("navigation", {
      name: /mobile homepage sections/i,
    });

    expect(main).toHaveAttribute("data-mobile-home-layout", "stacked");
    expect(main).toHaveAttribute("data-home-interaction-mode", "touch-static");
    expect(within(sectionNav).getByRole("link", { name: /博客/i })).toHaveAttribute(
      "href",
      "#selected-writing",
    );
    expect(within(sectionNav).getByRole("link", { name: /作者/i })).toHaveAttribute(
      "href",
      "#author-profile",
    );
  });

  it("keeps blog and author content directly available without gesture-only access", () => {
    render(<MobileHome data={mobileHomeData} />);

    expect(screen.getByRole("heading", { name: /notes without choreography/i })).toBeInTheDocument();

    const blogPanel = screen.getByRole("region", { name: /selected writing/i });
    const authorPanel = screen.getByRole("region", { name: /author profile/i });

    expect(within(blogPanel).getByRole("link", { name: /mobile shell post/i })).toBeInTheDocument();
    expect(within(authorPanel).getByText(/builder and writer/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /exit focus/i })).not.toBeInTheDocument();
  });
});
