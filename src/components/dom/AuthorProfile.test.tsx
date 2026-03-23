import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthorProfile } from "@/components/dom/AuthorProfile";
import type { AuthorInfo } from "@/lib/data";

const info: AuthorInfo = {
  name: "Woodfish",
  title: "Creative Developer",
  slogan: "Build vivid things.",
  intro: "Short bio",
  avatar: "https://example.com/avatar.png",
  postsCount: 3,
  tagsCount: 4,
  categoriesCount: 2,
  skills: [
    {
      title: "Three.js",
      color: "#000000",
      img: "https://example.com/three.png",
    },
    {
      title: "TypeScript",
      color: "#3178C6",
      img: "https://example.com/typescript.png",
    },
  ],
  tags: ["builder"],
};

describe("AuthorProfile", () => {
  it("renders capabilities as immediately visible cards with logos already in color", () => {
    render(<AuthorProfile info={info} />);

    const firstSkillTitle = screen.getByText("Three.js");
    const secondSkillTitle = screen.getByText("TypeScript");
    const firstSkillCard = firstSkillTitle.closest(".group\\/skill");
    const firstSkillLogo = screen.getByAltText("Three.js");

    expect(firstSkillTitle).toBeVisible();
    expect(secondSkillTitle).toBeVisible();
    expect(firstSkillCard).not.toHaveStyle({ opacity: "0" });
    expect(firstSkillCard).not.toHaveStyle({ transform: "translateY(15px)" });
    expect(firstSkillLogo).not.toHaveClass("grayscale");
    expect(firstSkillLogo).not.toHaveClass("opacity-40");
  });
});
