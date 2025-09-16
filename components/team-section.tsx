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
    name: "Dr. Sarah Chen",
    role: "Lead Data Scientist",
    expertise: "Satellite Imagery Analysis",
    image: "/professional-woman-scientist.png",
    location: "San Francisco, CA",
    experience: "8 years",
    education: "PhD in Remote Sensing, Stanford University",
    bio: "Dr. Chen specializes in machine learning applications for satellite imagery analysis. She has published 25+ papers on environmental monitoring and leads our AI research initiatives.",
    skills: ["Machine Learning", "Remote Sensing", "Python", "TensorFlow", "GDAL"],
    achievements: ["NASA Early Career Award 2022", "Published 25+ peer-reviewed papers", "Led $2M NSF research grant"],
    projects: ["Amazon Deforestation Detection System", "Arctic Ice Monitoring Platform", "Urban Heat Island Analysis"],
    social: {
      linkedin: "https://linkedin.com/in/sarahchen",
      github: "https://github.com/sarahchen",
      email: "sarah.chen@leolab.com",
    },
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Full-Stack Developer",
    expertise: "NASA API Integration",
    image: "/professional-man-developer.png",
    location: "Austin, TX",
    experience: "6 years",
    education: "MS Computer Science, UT Austin",
    bio: "Marcus is our technical lead for NASA API integrations and platform architecture. He has extensive experience building scalable geospatial applications.",
    skills: ["React", "Node.js", "NASA APIs", "PostgreSQL", "Docker"],
    achievements: [
      "NASA Space Apps Challenge Winner 2023",
      "Built 10+ production geospatial apps",
      "Open source contributor (5k+ GitHub stars)",
    ],
    projects: ["Real-time Satellite Data Pipeline", "3D Earth Visualization Engine", "NASA API Integration Framework"],
    social: {
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      github: "https://github.com/marcusrodriguez",
      email: "marcus.rodriguez@leolab.com",
    },
  },
  {
    id: 3,
    name: "Dr. Aisha Patel",
    role: "Environmental Engineer",
    expertise: "Climate Modeling",
    image: "/professional-woman-engineer.png",
    location: "Boulder, CO",
    experience: "10 years",
    education: "PhD Environmental Engineering, MIT",
    bio: "Dr. Patel brings deep expertise in climate modeling and environmental systems. She previously worked at NOAA and has extensive field research experience.",
    skills: ["Climate Modeling", "Environmental Systems", "MATLAB", "R", "GIS"],
    achievements: [
      "NOAA Outstanding Achievement Award",
      "30+ publications in Nature, Science",
      "IPCC Contributing Author",
    ],
    projects: ["Global Carbon Cycle Modeling", "Climate Change Impact Assessment", "Ecosystem Health Monitoring"],
    social: {
      linkedin: "https://linkedin.com/in/aishapatel",
      github: "https://github.com/aishapatel",
      email: "aisha.patel@leolab.com",
    },
  },
  {
    id: 4,
    name: "James Kim",
    role: "ML Engineer",
    expertise: "Computer Vision & AI",
    image: "/professional-ai-engineer.png",
    location: "Seattle, WA",
    experience: "5 years",
    education: "MS AI/ML, University of Washington",
    bio: "James specializes in computer vision and deep learning for environmental applications. He previously worked at Microsoft AI Research.",
    skills: ["PyTorch", "Computer Vision", "MLOps", "Kubernetes", "CUDA"],
    achievements: ["Microsoft AI Research Alumni", "3 patents in computer vision", "Top 1% Kaggle competitor"],
    projects: ["Automated Change Detection Models", "Satellite Image Classification", "Real-time Environmental Alerts"],
    social: {
      linkedin: "https://linkedin.com/in/jameskim",
      github: "https://github.com/jameskim",
      email: "james.kim@leolab.com",
    },
  },
  {
    id: 5,
    name: "Elena Volkov",
    role: "Geospatial Analyst",
    expertise: "GIS & Remote Sensing",
    image: "/professional-woman-geospatial-analyst.png",
    location: "Denver, CO",
    experience: "7 years",
    education: "MS Geography, University of Colorado",
    bio: "Elena is our GIS expert with extensive experience in remote sensing and spatial analysis. She specializes in large-scale environmental monitoring.",
    skills: ["ArcGIS", "QGIS", "Remote Sensing", "Spatial Analysis", "PostGIS"],
    achievements: [
      "ESRI Young Professional Award",
      "Led 15+ environmental assessments",
      "GIS certification instructor",
    ],
    projects: ["Global Forest Monitoring System", "Water Resource Assessment Tools", "Land Use Change Analysis"],
    social: {
      linkedin: "https://linkedin.com/in/elenavolkov",
      github: "https://github.com/elenavolkov",
      email: "elena.volkov@leolab.com",
    },
  },
  {
    id: 6,
    name: "Dr. Ahmed Hassan",
    role: "Research Director",
    expertise: "Earth System Science",
    image: "/professional-man-research-director.png",
    location: "Washington, DC",
    experience: "15 years",
    education: "PhD Earth System Science, NASA GSFC",
    bio: "Dr. Hassan leads our research strategy and partnerships. Former NASA scientist with expertise in Earth system science and satellite missions.",
    skills: ["Earth System Science", "Satellite Missions", "Research Strategy", "Grant Writing", "Team Leadership"],
    achievements: [
      "Former NASA Principal Investigator",
      "50+ publications, 2000+ citations",
      "Led 3 satellite mission proposals",
    ],
    projects: ["Earth System Monitoring Strategy", "NASA Partnership Development", "Climate Research Coordination"],
    social: {
      linkedin: "https://linkedin.com/in/ahmedhassan",
      github: "https://github.com/ahmedhassan",
      email: "ahmed.hassan@leolab.com",
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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
        </div>

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
                  <div className="text-lg font-bold text-primary mb-1">NASA</div>
                  <p className="text-sm text-muted-foreground">Former Scientists</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary mb-1">MIT/Stanford</div>
                  <p className="text-sm text-muted-foreground">PhD Alumni</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary mb-1">Microsoft</div>
                  <p className="text-sm text-muted-foreground">AI Research</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary mb-1">NOAA</div>
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
