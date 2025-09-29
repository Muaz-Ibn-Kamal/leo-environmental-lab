"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  GraduationCap,
  Award,
  Calendar,
  Users,
  Brain,
  Code,
  Microscope,
  Globe,
  Database,
  Satellite,
} from "lucide-react"

// Enhanced team member data
const teamMembers = [
  {
    id: 1,
    name: "Muaz Ibn Kamal",
    role: "Team Lead",
    expertise: "Web Developer & Designer",
    image: "/images/team/muaz-ibn-kamal.jpg",
    location: "Dhaka,Bangladesh",
    experience: "1 Year",
    education: "Bsc in CSE, Green University of Bangladesh",
    bio: "A passionate technology enthusiast with expertise in computer science, AI, and creative innovation. Dedicated to developing impactful solutions, driving collaboration, and fostering sustainable growth",
    skills: ["Java Script", "React", "Python", "TensorFlow"],
    achievements: ["Hult Prize 2025 On Campus Finalist"],
    projects: ["Joruri Sheba", "G3 Architecture", "Bio Harvest"],
    social: {
      linkedin: "https://linkedin.com/in/muaz-ibn-kamal/",
      github: "https://github.com/Muaz-Ibn-Kamal",
      email: "muazibnkamal8@gmail.com",
    },
  },
  {
    id: 2,
    name: "Md. Mirajul Islam ",
    role: "Team Member",
    expertise: "Climate-Tech Innovator & PR Specialist",
    image: "/images/team/mirajul-islam.jpg",
    location: "Dhaka,Bangladesh",
    experience: "4+ Years (Youth Leadership & Environmental Projects",
    education: "B.Sc in Computer Science and Engineering, United International University",
    bio: "A dedicated climate activist and technology enthusiast, combining expertise in computer science, environmental innovation, and public relations. Focused on developing sustainable solutions and empowering youth-led initiatives to address global challenges in climate and sustainability",
    skills: [
      "Public Relations",
      "Leadership",
      "Research & Data Analysis",
      "Environmental Sciences",
      "Sustainability Advocacy",
    ],
    achievements: [
      "Nominated for 2025 Tällberg-SNF-Eliasson Global Leadership Prize",
      "Most Innovative Environmental Sciences CEO 2024 (South Asia)",
      "Winner (Environment Sector) - KIDLON Junior Talent Awards 2025",
    ],
    projects: ["Earth's Ants", "ANTHROGEN Lab", "Minds&Bins", "CODE RED"],
    social: {
      linkedin: "https://linkedin.com/in/mirajulislam003",
      github: "https://github.com/miraj-004",
      email: "mirajulnijhumofficial@gmail.com",
    },
  },
  {
    id: 3,
    name: "Mahbub Anam",
    role: "ML Engineer",
    expertise: "ML & Data Science",
    image: "/images/team/mahbub-anam.jpg",
    location: "Dhaka,Bangladesh",
    experience: "3 years",
    education: "Bsc in CSE, North South University",
    bio: "Mahbub is a data scientist with a focus on environmental data analysis and machine learning. He has worked on several climate modeling projects.",
    skills: ["Climate Modeling", "Environmental Systems", "MATLAB", "R", "GIS"],
    achievements: [
      "North South University Assistant Cyber Security Expert",
      "Developed 5+ ML models for environmental data",
    ],
    projects: [" MemoryAnalyz3r", " akari-telegram", " Infinity-Creators"],
    social: {
      linkedin: "https://linkedin.com/in/aishapatel",
      github: "https://github.com/Rhythm113",
      email: "mahbubanamrhythm@gmail.com",
    },
  },
  {
    id: 4,
    name: "Nuren Tasnim",
    role: "Team Member",
    expertise: "Sustainability Advocate & Youth Leader",
    image: "/images/team/nuren-tasnim.jpg",
    location: "Dhaka,Bangladesh",
    experience: "2 years",
    education: "Bsc in EEE, Ahsanullah University of Science and Technology",
    bio: "Curious mind exploring EEE, innovation, and sustainability—driven to turn ideas into real impact.",
    skills: ["Leadership", " sustainability", "innovation", " EEE fundamentals", "communication"],
    achievements: ["Microsoft AI Research Alumni", "3 patents in computer vision", "Top 1% Kaggle competitor"],
    projects: ["Automated Change Detection Models", "Satellite Image Classification", "Real-time Environmental Alerts"],
    social: {
      linkedin: "https://www.linkedin.com/in/tasnim-nuren/",
      github: "",
      email: "tasnimnuren@gmail.com",
    },
  },
  {
    id: 5,
    name: "Rafi Ahmed Fida",
    role: "Team Member",
    expertise: "ML & Data Science",
    image: "/images/team/rafi-ahmed-fida.jpg",
    location: "Dhaka,Bangladesh",
    experience: "2 years",
    education: "Bsc in CSE, East West University",
    bio: " Rafi is a data scientist with a focus on environmental data analysis and machine learning. He has worked on several climate modeling projects.",
    skills: ["ArcGIS", "QGIS", "Spatial Analysis", "PostGIS"],
    achievements: ["East West University Data Science Club ", "Developed 3 ML models for environmental data"],
    projects: ["", "Water Resource Assessment Tools", "Land Use Change Analysis"],
    social: {
      linkedin: "https://linkedin.com/in/elenavolkov",
      github: "https://github.com/elenavolkov",
      email: "elena.volkov@leolab.com",
    },
  },
  {
    id: 6,
    name: "Raid Hossain Neloy",
    role: "Design Lead",
    expertise: "Graphic Designer & Illustrator",
    image: "/images/team/raid-hossain-neloy.jpg",
    location: "Dhaka,Bangladesh",
    experience: "5 years",
    education: "BBA in Economics, Green University of Bangladesh",
    bio: "Raid is a creative graphic designer and illustrator with a passion for visual storytelling. With over 5 years of experience, he has worked on diverse projects ranging from branding to digital art, consistently delivering compelling designs that resonate with audiences.",
    skills: ["Adobe Creative Suite", "Illustration", "Branding", "Typography"],
    achievements: [
      "Freelance Graphic Designer for 50+ clients",
      "Exhibited artwork in 3 local galleries",
      " Won 2 design competitions",
    ],
    projects: ["Brand Identity for Local Startups", "Illustrated Children's Book", "Social Media Campaigns"],
    social: {
      linkedin: " www.linkedin.com/in/raidhossainneloy",
      github: "",
      email: "raidhossain40@gmail.com",
    },
  },
]

const getRoleIcon = (role: string) => {
  if (role.includes("Data Scientist")) return <Brain className="w-5 h-5" />
  if (role.includes("Developer")) return <Code className="w-5 h-5" />
  if (role.includes("Engineer")) return <Microscope className="w-5 h-5" />
  if (role.includes("ML")) return <Brain className="w-5 h-5" />
  if (role.includes("Analyst")) return <Globe className="w-5 h-5" />
  if (role.includes("Director")) return <Users className="w-5 h-5" />
  return <Satellite className="w-5 h-5" />
}

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState(null)

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Expert Team</h2>
          <p className="text-xl text-muted-foreground">
            Six specialists driving innovation in environmental intelligence
          </p>
        </div>

        {/* Team Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">50+</div>
              <p className="text-sm text-muted-foreground">Years Combined Experience</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">100+</div>
              <p className="text-sm text-muted-foreground">Research Publications</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">15+</div>
              <p className="text-sm text-muted-foreground">Awards & Recognition</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">6</div>
              <p className="text-sm text-muted-foreground">Countries Represented</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Team Member Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="group hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getRoleIcon(member.role)}
                      <p className="text-primary font-medium text-sm">{member.role}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      {member.location}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{member.bio}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {member.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Github className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden">
                            <img
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                            <DialogDescription className="text-lg text-primary font-medium">
                              {member.role}
                            </DialogDescription>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {member.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {member.experience} experience
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogHeader>

                      <Tabs defaultValue="about" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="about">About</TabsTrigger>
                          <TabsTrigger value="skills">Skills</TabsTrigger>
                          <TabsTrigger value="achievements">Awards</TabsTrigger>
                          <TabsTrigger value="projects">Projects</TabsTrigger>
                        </TabsList>

                        <TabsContent value="about" className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" />
                              Education
                            </h4>
                            <p className="text-sm text-muted-foreground">{member.education}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Biography</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                          </div>
                        </TabsContent>

                        <TabsContent value="skills" className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {member.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="achievements" className="space-y-4">
                          <div className="space-y-3">
                            {member.achievements.map((achievement, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="projects" className="space-y-4">
                          <div className="space-y-3">
                            {member.projects.map((project, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <Database className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{project}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="flex justify-center gap-4 pt-4 border-t">
                        <Button size="sm" variant="outline" className="flex items-center gap-2 bg-transparent">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-2 bg-transparent">
                          <Github className="w-4 h-4" />
                          GitHub
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-2 bg-transparent">
                          <Mail className="w-4 h-4" />
                          Email
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Collaboration Section */}
        <div className="mt-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Collaborative Excellence</CardTitle>
              <CardDescription>
                Our diverse team brings together expertise from leading institutions and organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-lg font-bold text-primary mb-1">Earth's Ants</div>
                  <p className="text-sm text-muted-foreground">Presidential Board Member</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary mb-1">GUB/UIU/NSU/EWU/AUST</div>
                  <p className="text-sm text-muted-foreground">Student</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary mb-1">Anthrogen Lab</div>
                  <p className="text-sm text-muted-foreground">Founding Directors</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary mb-1">Earths Ant's</div>
                  <p className="text-sm text-muted-foreground">Climate Experts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
