"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  GraduationCap,
  Building2,
  Stethoscope,
  Scissors,
  Heart,
  BookOpen,
  CalendarCheck,
  Clock,
  MonitorSmartphone,
  Award,
  Users,
  Newspaper,
  Image as ImageIcon,
  Check,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Profile } from "@/types/database";
import { SectionWrapper } from "./section-wrapper";
import { ArrayEditor } from "./array-editor";
import { TagInput } from "./tag-input";
import { VideoEmbedPreview } from "./video-embed-preview";
import { ImageGalleryEditor } from "./image-gallery-editor";
import { AIEnhanceButton } from "@/components/ui/ai-enhance-button";
import { AISuggestTags } from "@/components/ui/ai-suggest-tags";
import { cn } from "@/lib/utils";

interface ProfileBuilderProps {
  profile: Profile;
}

type EducationItem = {
  institution: string;
  degree: string;
  year: string;
  [key: string]: string;
};

type HospitalItem = {
  name: string;
  role: string;
  department: string;
  [key: string]: string;
};

type CaseStudyItem = {
  title: string;
  description: string;
  outcome: string;
  [key: string]: string;
};

type MembershipItem = {
  organization: string;
  year: string;
  [key: string]: string;
};

type MediaItem = {
  title: string;
  publication: string;
  link: string;
  year: string;
  [key: string]: string;
};

interface GalleryImage {
  url: string;
  caption?: string;
}

type SectionVisibility = Record<string, boolean>;

export function ProfileBuilder({ profile }: ProfileBuilderProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Section visibility state
  const [visibility, setVisibility] = useState<SectionVisibility>(
    (profile.section_visibility as SectionVisibility) || {}
  );

  // Form state for all fields
  const [formData, setFormData] = useState({
    videoIntroductionUrl: profile.video_introduction_url || "",
    approachToCare: profile.approach_to_care || "",
    firstVisitGuide: profile.first_visit_guide || "",
    availabilityNote: profile.availability_note || "",
    conditionsTreated: profile.conditions_treated || "",
    proceduresPerformed: profile.procedures_performed || "",
    isAvailable: profile.is_available ?? true,
    offersTelemedicine: profile.offers_telemedicine ?? false,
    educationTimeline: (profile.education_timeline as unknown as EducationItem[]) || [],
    hospitalAffiliations: (profile.hospital_affiliations as unknown as HospitalItem[]) || [],
    caseStudies: (profile.case_studies as unknown as CaseStudyItem[]) || [],
    clinicGallery: (profile.clinic_gallery as unknown as GalleryImage[]) || [],
    professionalMemberships: (profile.professional_memberships as unknown as MembershipItem[]) || [],
    mediaPublications: (profile.media_publications as unknown as MediaItem[]) || [],
  });

  // Sections are OFF by default unless explicitly set to true
  const isSectionVisible = (key: string) => {
    return visibility[key] === true;
  };

  const toggleVisibility = (key: string, visible: boolean) => {
    setVisibility((prev) => ({ ...prev, [key]: visible }));
  };

  const updateField = useCallback(<K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sectionVisibility: visibility,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast.success("Profile Updated", {
        description: "Your profile has been saved successfully.",
      });

      router.refresh();
    } catch {
      toast.error("Error", {
        description: "Failed to save profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header - Mobile optimized */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Profile Builder
        </h1>
        <p className="text-sm text-slate-500">
          Add content to enrich your public profile. Toggle visibility for each section.
        </p>
      </div>

      {/* Sections - Better spacing */}
      <div className="space-y-4 sm:space-y-5">
        {/* Video Introduction */}
        <SectionWrapper
          title="Video Introduction"
          description="Add a personal video to connect with patients"
          icon={<Video className="w-5 h-5" />}
          isVisible={isSectionVisible("video")}
          onVisibilityChange={(v) => toggleVisibility("video", v)}
        >
          <VideoEmbedPreview
            value={formData.videoIntroductionUrl}
            onChange={(v) => updateField("videoIntroductionUrl", v)}
          />
        </SectionWrapper>

        {/* Education Timeline */}
        <SectionWrapper
          title="Education & Training"
          description="Your academic background and certifications"
          icon={<GraduationCap className="w-5 h-5" />}
          isVisible={isSectionVisible("education")}
          onVisibilityChange={(v) => toggleVisibility("education", v)}
        >
          <ArrayEditor<EducationItem>
            items={formData.educationTimeline}
            onChange={(items) => updateField("educationTimeline", items)}
            fields={[
              { name: "institution", label: "Institution", type: "text", placeholder: "e.g., AIIMS Delhi", required: true },
              { name: "degree", label: "Degree/Certification", type: "text", placeholder: "e.g., MBBS, MD Cardiology", required: true },
              { name: "year", label: "Year", type: "year", placeholder: "2015" },
            ]}
            addLabel="Add Education"
            emptyMessage="No education entries added yet"
            maxItems={10}
          />
        </SectionWrapper>

        {/* Hospital Affiliations */}
        <SectionWrapper
          title="Hospital Affiliations"
          description="Hospitals and clinics where you practice"
          icon={<Building2 className="w-5 h-5" />}
          isVisible={isSectionVisible("hospitals")}
          onVisibilityChange={(v) => toggleVisibility("hospitals", v)}
        >
          <ArrayEditor<HospitalItem>
            items={formData.hospitalAffiliations}
            onChange={(items) => updateField("hospitalAffiliations", items)}
            fields={[
              { name: "name", label: "Hospital/Clinic Name", type: "text", placeholder: "e.g., Apollo Hospital", required: true },
              { name: "role", label: "Role/Position", type: "text", placeholder: "e.g., Senior Consultant", required: true },
              { name: "department", label: "Department", type: "text", placeholder: "e.g., Cardiology" },
            ]}
            addLabel="Add Affiliation"
            emptyMessage="No hospital affiliations added yet"
            maxItems={5}
          />
        </SectionWrapper>

        {/* Conditions Treated */}
        <SectionWrapper
          title="Conditions Treated"
          description="Medical conditions you specialize in treating"
          icon={<Stethoscope className="w-5 h-5" />}
          isVisible={isSectionVisible("conditions")}
          onVisibilityChange={(v) => toggleVisibility("conditions", v)}
        >
          <div className="space-y-4">
            <TagInput
              value={formData.conditionsTreated}
              onChange={(v) => updateField("conditionsTreated", v)}
              placeholder="e.g., Hypertension"
              maxTags={30}
            />
            <AISuggestTags
              currentTags={formData.conditionsTreated ? formData.conditionsTreated.split(",").map(t => t.trim()).filter(Boolean) : []}
              specialty={profile.specialty || ""}
              type="conditions"
              onAddTag={(tag) => {
                const currentTags = formData.conditionsTreated ? formData.conditionsTreated.split(",").map(t => t.trim()).filter(Boolean) : [];
                if (!currentTags.includes(tag)) {
                  updateField("conditionsTreated", [...currentTags, tag].join(", "));
                }
              }}
              disabled={!profile.specialty}
            />
          </div>
        </SectionWrapper>

        {/* Procedures Performed */}
        <SectionWrapper
          title="Procedures & Treatments"
          description="Medical procedures and treatments you perform"
          icon={<Scissors className="w-5 h-5" />}
          isVisible={isSectionVisible("procedures")}
          onVisibilityChange={(v) => toggleVisibility("procedures", v)}
        >
          <div className="space-y-4">
            <TagInput
              value={formData.proceduresPerformed}
              onChange={(v) => updateField("proceduresPerformed", v)}
              placeholder="e.g., Angioplasty"
              maxTags={30}
            />
            <AISuggestTags
              currentTags={formData.proceduresPerformed ? formData.proceduresPerformed.split(",").map(t => t.trim()).filter(Boolean) : []}
              specialty={profile.specialty || ""}
              type="procedures"
              onAddTag={(tag) => {
                const currentTags = formData.proceduresPerformed ? formData.proceduresPerformed.split(",").map(t => t.trim()).filter(Boolean) : [];
                if (!currentTags.includes(tag)) {
                  updateField("proceduresPerformed", [...currentTags, tag].join(", "));
                }
              }}
              disabled={!profile.specialty}
            />
          </div>
        </SectionWrapper>

        {/* Approach to Care */}
        <SectionWrapper
          title="Approach to Care"
          description="Your philosophy and approach to patient care"
          icon={<Heart className="w-5 h-5" />}
          isVisible={isSectionVisible("approach")}
          onVisibilityChange={(v) => toggleVisibility("approach", v)}
        >
          <div className="space-y-3">
            <Textarea
              value={formData.approachToCare}
              onChange={(e) => updateField("approachToCare", e.target.value)}
              placeholder="Describe your approach to patient care, your values, and what patients can expect when visiting you..."
              className="min-h-[140px] text-base rounded-xl border-slate-200 focus:border-emerald-300 focus:ring-emerald-100"
              maxLength={2000}
            />
            <div className="flex items-center justify-between">
              <AIEnhanceButton
                text={formData.approachToCare}
                type="approach"
                onEnhance={(text) => updateField("approachToCare", text)}
              />
              <p className="text-xs text-slate-400">
                {formData.approachToCare.length}/2000
              </p>
            </div>
          </div>
        </SectionWrapper>

        {/* Case Studies */}
        <SectionWrapper
          title="Case Studies"
          description="Notable cases that showcase your expertise"
          icon={<BookOpen className="w-5 h-5" />}
          isVisible={isSectionVisible("cases")}
          onVisibilityChange={(v) => toggleVisibility("cases", v)}
          badge="PRO"
        >
          <ArrayEditor<CaseStudyItem>
            items={formData.caseStudies}
            onChange={(items) => updateField("caseStudies", items)}
            fields={[
              { name: "title", label: "Case Title", type: "text", placeholder: "e.g., Complex Cardiac Surgery", required: true },
              { name: "description", label: "Description", type: "textarea", placeholder: "Describe the case and your approach..." },
              { name: "outcome", label: "Outcome", type: "text", placeholder: "e.g., Full recovery within 2 weeks" },
            ]}
            addLabel="Add Case Study"
            emptyMessage="No case studies added yet"
            maxItems={5}
          />
        </SectionWrapper>

        {/* First Visit Guide */}
        <SectionWrapper
          title="First Visit Guide"
          description="What new patients should know before visiting"
          icon={<CalendarCheck className="w-5 h-5" />}
          isVisible={isSectionVisible("firstVisit")}
          onVisibilityChange={(v) => toggleVisibility("firstVisit", v)}
        >
          <div className="space-y-3">
            <Textarea
              value={formData.firstVisitGuide}
              onChange={(e) => updateField("firstVisitGuide", e.target.value)}
              placeholder="What should patients bring? What to expect? Any preparation needed?..."
              className="min-h-[140px] text-base rounded-xl border-slate-200 focus:border-emerald-300 focus:ring-emerald-100"
              maxLength={2000}
            />
            <div className="flex items-center justify-between">
              <AIEnhanceButton
                text={formData.firstVisitGuide}
                type="first_visit"
                onEnhance={(text) => updateField("firstVisitGuide", text)}
              />
              <p className="text-xs text-slate-400">
                {formData.firstVisitGuide.length}/2000
              </p>
            </div>
          </div>
        </SectionWrapper>

        {/* Availability */}
        <SectionWrapper
          title="Availability Status"
          description="Let patients know if you're accepting new patients"
          icon={<Clock className="w-5 h-5" />}
          isVisible={isSectionVisible("availability")}
          onVisibilityChange={(v) => toggleVisibility("availability", v)}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-full",
                  formData.isAvailable ? "bg-emerald-500" : "bg-red-400"
                )} />
                <div>
                  <Label className="text-sm font-medium">
                    {formData.isAvailable ? "Accepting New Patients" : "Not Accepting New Patients"}
                  </Label>
                  <p className="text-xs text-slate-500">
                    Shown on your public profile
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(v) => updateField("isAvailable", v)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-slate-600">Availability Note (Optional)</Label>
              <Input
                value={formData.availabilityNote}
                onChange={(e) => updateField("availabilityNote", e.target.value)}
                placeholder="e.g., Available Mondays and Thursdays only"
                className="h-12 text-base rounded-xl"
                maxLength={500}
              />
            </div>
          </div>
        </SectionWrapper>

        {/* Telemedicine */}
        <SectionWrapper
          title="Telemedicine"
          description="Online consultations availability"
          icon={<MonitorSmartphone className="w-5 h-5" />}
          isVisible={isSectionVisible("telemedicine")}
          onVisibilityChange={(v) => toggleVisibility("telemedicine", v)}
        >
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <MonitorSmartphone className={cn(
                "w-5 h-5",
                formData.offersTelemedicine ? "text-emerald-600" : "text-slate-400"
              )} />
              <div>
                <Label className="text-sm font-medium">
                  {formData.offersTelemedicine ? "Telemedicine Available" : "Telemedicine Not Available"}
                </Label>
                <p className="text-xs text-slate-500">
                  Let patients know you offer online consultations
                </p>
              </div>
            </div>
            <Switch
              checked={formData.offersTelemedicine}
              onCheckedChange={(v) => updateField("offersTelemedicine", v)}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </SectionWrapper>

        {/* Achievement Badges */}
        <SectionWrapper
          title="Achievement Badges"
          description="Badges earned through platform achievements"
          icon={<Award className="w-5 h-5" />}
          isVisible={isSectionVisible("badges")}
          onVisibilityChange={(v) => toggleVisibility("badges", v)}
          badge="ADMIN"
        >
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">Badges are awarded by the platform</p>
            <p className="text-xs text-slate-400 mt-1">
              Keep building your profile to earn badges
            </p>
          </div>
        </SectionWrapper>

        {/* Professional Memberships */}
        <SectionWrapper
          title="Professional Memberships"
          description="Medical associations and organizations"
          icon={<Users className="w-5 h-5" />}
          isVisible={isSectionVisible("memberships")}
          onVisibilityChange={(v) => toggleVisibility("memberships", v)}
        >
          <ArrayEditor<MembershipItem>
            items={formData.professionalMemberships}
            onChange={(items) => updateField("professionalMemberships", items)}
            fields={[
              { name: "organization", label: "Organization", type: "text", placeholder: "e.g., Indian Medical Association", required: true },
              { name: "year", label: "Member Since", type: "year", placeholder: "2010" },
            ]}
            addLabel="Add Membership"
            emptyMessage="No memberships added yet"
            maxItems={10}
          />
        </SectionWrapper>

        {/* Media & Publications */}
        <SectionWrapper
          title="Media & Publications"
          description="Articles, research papers, and media appearances"
          icon={<Newspaper className="w-5 h-5" />}
          isVisible={isSectionVisible("media")}
          onVisibilityChange={(v) => toggleVisibility("media", v)}
        >
          <ArrayEditor<MediaItem>
            items={formData.mediaPublications}
            onChange={(items) => updateField("mediaPublications", items)}
            fields={[
              { name: "title", label: "Title", type: "text", placeholder: "e.g., Understanding Heart Health", required: true },
              { name: "publication", label: "Publication/Source", type: "text", placeholder: "e.g., Times of India, IJMR", required: true },
              { name: "link", label: "Link (Optional)", type: "text", placeholder: "https://..." },
              { name: "year", label: "Year", type: "year", placeholder: "2023" },
            ]}
            addLabel="Add Publication"
            emptyMessage="No publications added yet"
            maxItems={10}
          />
        </SectionWrapper>

        {/* Clinic Gallery */}
        <SectionWrapper
          title="Clinic Gallery"
          description="Photos of your clinic, equipment, and facilities"
          icon={<ImageIcon className="w-5 h-5" />}
          isVisible={isSectionVisible("gallery")}
          onVisibilityChange={(v) => toggleVisibility("gallery", v)}
        >
          <ImageGalleryEditor
            images={formData.clinicGallery}
            onChange={(images) => updateField("clinicGallery", images)}
            maxImages={6}
            profileId={profile.id}
          />
        </SectionWrapper>
      </div>

      {/* Bottom Save Button - Fixed on mobile, sleek design */}
      <div className="sticky bottom-20 sm:bottom-4 pt-3 pb-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] shadow-md",
            isSaving
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-600 hover:to-blue-600"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save All Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
