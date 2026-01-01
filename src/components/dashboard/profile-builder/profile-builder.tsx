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
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const isSectionVisible = (key: string) => {
    return visibility[key] !== false;
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile Builder</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enrich your public profile with additional content
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Sections */}
      <div className="space-y-4">
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
          <TagInput
            value={formData.conditionsTreated}
            onChange={(v) => updateField("conditionsTreated", v)}
            placeholder="e.g., Hypertension, Diabetes, Heart Disease"
            maxTags={30}
          />
        </SectionWrapper>

        {/* Procedures Performed */}
        <SectionWrapper
          title="Procedures & Treatments"
          description="Medical procedures and treatments you perform"
          icon={<Scissors className="w-5 h-5" />}
          isVisible={isSectionVisible("procedures")}
          onVisibilityChange={(v) => toggleVisibility("procedures", v)}
        >
          <TagInput
            value={formData.proceduresPerformed}
            onChange={(v) => updateField("proceduresPerformed", v)}
            placeholder="e.g., Angioplasty, Bypass Surgery, ECG"
            maxTags={30}
          />
        </SectionWrapper>

        {/* Approach to Care */}
        <SectionWrapper
          title="Approach to Care"
          description="Your philosophy and approach to patient care"
          icon={<Heart className="w-5 h-5" />}
          isVisible={isSectionVisible("approach")}
          onVisibilityChange={(v) => toggleVisibility("approach", v)}
        >
          <div className="space-y-2">
            <Textarea
              value={formData.approachToCare}
              onChange={(e) => updateField("approachToCare", e.target.value)}
              placeholder="Describe your approach to patient care, your values, and what patients can expect when visiting you..."
              className="min-h-[120px]"
              maxLength={2000}
            />
            <p className="text-xs text-slate-500 text-right">
              {formData.approachToCare.length}/2000 characters
            </p>
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
          <div className="space-y-2">
            <Textarea
              value={formData.firstVisitGuide}
              onChange={(e) => updateField("firstVisitGuide", e.target.value)}
              placeholder="What should patients bring? What to expect? Any preparation needed?..."
              className="min-h-[120px]"
              maxLength={2000}
            />
            <p className="text-xs text-slate-500 text-right">
              {formData.firstVisitGuide.length}/2000 characters
            </p>
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
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${formData.isAvailable ? "bg-green-500" : "bg-red-500"}`} />
                <div>
                  <Label className="text-sm font-medium">
                    {formData.isAvailable ? "Accepting New Patients" : "Not Accepting New Patients"}
                  </Label>
                  <p className="text-xs text-slate-500">
                    This will be shown on your public profile
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(v) => updateField("isAvailable", v)}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-slate-700">Availability Note (Optional)</Label>
              <Input
                value={formData.availabilityNote}
                onChange={(e) => updateField("availabilityNote", e.target.value)}
                placeholder="e.g., Available Mondays and Thursdays only"
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
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MonitorSmartphone className={`w-5 h-5 ${formData.offersTelemedicine ? "text-[#0099F7]" : "text-slate-400"}`} />
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
              className="data-[state=checked]:bg-[#0099F7]"
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
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Badges are awarded by the platform</p>
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

      {/* Bottom Save Button (Mobile) */}
      <div className="sticky bottom-20 sm:bottom-4 pt-4 pb-2 bg-gradient-to-t from-slate-50 to-transparent">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] shadow-lg"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
