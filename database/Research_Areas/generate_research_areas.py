#!/usr/bin/env python3
"""
Generate comprehensive research areas for all academic fields
"""

import json
import os

# Research area templates and mappings
RESEARCH_AREA_MAPPINGS = {
    # Engineering Fields
    "engineering": [
        "Design and Optimization",
        "Materials and Manufacturing",
        "Systems and Control", 
        "Computational Modeling",
        "Sustainability and Environment",
        "Innovation and Technology",
        "Safety and Risk Assessment",
        "Energy and Power Systems",
        "Automation and Robotics",
        "Signal Processing and Communications",
        "Quality and Performance",
        "Maintenance and Reliability",
        "Human Factors",
        "Economics and Management",
        "Standards and Regulations",
        "Advanced Materials",
        "Sensors and Instrumentation",
        "Data Analytics",
        "Machine Learning Applications",
        "Future Technologies"
    ],
    
    # Computer Science Fields
    "computer_science": [
        "Algorithms and Data Structures",
        "Machine Learning and AI",
        "Software Engineering",
        "Database Systems",
        "Computer Networks",
        "Cybersecurity",
        "Human-Computer Interaction",
        "Computer Graphics",
        "Distributed Systems",
        "Mobile Computing",
        "Cloud Computing",
        "Big Data Analytics",
        "Computer Vision",
        "Natural Language Processing",
        "Robotics",
        "Quantum Computing",
        "Blockchain Technology",
        "Internet of Things",
        "Virtual and Augmented Reality",
        "Computational Theory"
    ],
    
    # Business Fields
    "business": [
        "Strategic Planning",
        "Market Analysis",
        "Financial Management",
        "Operations Optimization",
        "Leadership and Management",
        "Innovation and Entrepreneurship",
        "Digital Transformation",
        "Customer Experience",
        "Supply Chain Management",
        "Risk Management",
        "Performance Management",
        "Organizational Behavior",
        "Business Analytics",
        "Sustainability",
        "International Business",
        "Corporate Governance",
        "Change Management",
        "Quality Management",
        "Knowledge Management",
        "Business Intelligence"
    ],
    
    # Health Sciences
    "health": [
        "Clinical Research",
        "Patient Care and Safety",
        "Health Technology",
        "Disease Prevention",
        "Treatment Innovations",
        "Health Policy",
        "Public Health",
        "Health Education",
        "Healthcare Management",
        "Medical Devices",
        "Diagnostic Methods",
        "Therapeutic Approaches",
        "Health Informatics",
        "Evidence-Based Practice",
        "Healthcare Quality",
        "Population Health",
        "Global Health",
        "Health Economics",
        "Health Communication",
        "Health Promotion"
    ],
    
    # Natural Sciences
    "science": [
        "Fundamental Research",
        "Applied Research",
        "Experimental Methods",
        "Theoretical Models",
        "Computational Science",
        "Data Analysis",
        "Laboratory Techniques",
        "Field Studies",
        "Interdisciplinary Research",
        "Innovation and Discovery",
        "Environmental Applications",
        "Industrial Applications",
        "Medical Applications",
        "Technology Development",
        "Research Methods",
        "Scientific Communication",
        "Ethics and Policy",
        "Education and Outreach",
        "Collaboration and Networking",
        "Future Directions"
    ],
    
    # Social Sciences
    "social": [
        "Social Theory",
        "Research Methods",
        "Data Analysis",
        "Policy Analysis",
        "Community Studies",
        "Cultural Analysis",
        "Behavioral Studies",
        "Social Change",
        "Social Justice",
        "Diversity and Inclusion",
        "Global Perspectives",
        "Historical Analysis",
        "Comparative Studies",
        "Applied Research",
        "Social Innovation",
        "Public Engagement",
        "Ethical Considerations",
        "Technology and Society",
        "Future Trends",
        "Interdisciplinary Approaches"
    ],
    
    # Arts and Design
    "arts": [
        "Creative Practice",
        "Design Innovation",
        "Aesthetic Theory",
        "Cultural Expression",
        "Digital Arts",
        "Traditional Techniques",
        "Contemporary Approaches",
        "Art Education",
        "Art Therapy",
        "Community Arts",
        "Art History",
        "Critical Studies",
        "Performance Studies",
        "Visual Communication",
        "Interactive Media",
        "Art and Technology",
        "Cultural Heritage",
        "Art Business",
        "Public Art",
        "Art and Society"
    ],
    
    # Education
    "education": [
        "Learning Theory",
        "Curriculum Development",
        "Teaching Methods",
        "Educational Technology",
        "Assessment and Evaluation",
        "Student Development",
        "Educational Leadership",
        "School Improvement",
        "Special Needs Education",
        "Multicultural Education",
        "Distance Learning",
        "Professional Development",
        "Educational Policy",
        "Research Methods",
        "Educational Psychology",
        "Classroom Management",
        "Educational Innovation",
        "Community Engagement",
        "Educational Equity",
        "Future of Education"
    ],
    
    # Agriculture
    "agriculture": [
        "Crop Production",
        "Livestock Management",
        "Sustainable Farming",
        "Agricultural Technology",
        "Soil Management",
        "Water Resources",
        "Pest and Disease Control",
        "Agricultural Economics",
        "Food Security",
        "Climate Adaptation",
        "Precision Agriculture",
        "Organic Farming",
        "Agricultural Policy",
        "Rural Development",
        "Food Safety",
        "Agricultural Innovation",
        "Farm Management",
        "Agricultural Extension",
        "Environmental Impact",
        "Agricultural Research"
    ],
    
    # Law
    "law": [
        "Legal Theory",
        "Case Law Analysis",
        "Legal Practice",
        "Legal Research",
        "Legal Writing",
        "Court Procedures",
        "Legal Ethics",
        "Comparative Law",
        "International Law",
        "Legal Reform",
        "Access to Justice",
        "Legal Technology",
        "Alternative Dispute Resolution",
        "Legal Education",
        "Professional Development",
        "Legal Policy",
        "Human Rights",
        "Corporate Compliance",
        "Legal Innovation",
        "Future of Law"
    ],
    
    # Communication and Media
    "media": [
        "Content Creation",
        "Digital Media",
        "Audience Research",
        "Media Production",
        "Communication Theory",
        "Media Ethics",
        "Social Media",
        "Broadcasting",
        "Journalism",
        "Public Relations",
        "Advertising",
        "Media Technology",
        "Media Policy",
        "Global Media",
        "Media Literacy",
        "Strategic Communication",
        "Crisis Communication",
        "Media Innovation",
        "Media Business",
        "Future Media"
    ]
}

def get_field_category(field_name):
    """Determine the category for research area generation"""
    field_lower = field_name.lower()
    
    if any(term in field_lower for term in ["engineering", "technology"]):
        return "engineering"
    elif any(term in field_lower for term in ["computer", "software", "data", "cyber", "ai", "machine", "web", "mobile", "cloud", "blockchain", "quantum"]):
        return "computer_science"
    elif any(term in field_lower for term in ["business", "management", "marketing", "finance", "accounting", "administration"]):
        return "business"
    elif any(term in field_lower for term in ["medicine", "health", "medical", "nursing", "pharmacy", "therapy", "clinical"]):
        return "health"
    elif any(term in field_lower for term in ["biology", "chemistry", "physics", "mathematics", "science", "research"]):
        return "science"
    elif any(term in field_lower for term in ["psychology", "sociology", "anthropology", "political", "economics", "history", "philosophy"]):
        return "social"
    elif any(term in field_lower for term in ["art", "design", "music", "theater", "film", "creative", "visual"]):
        return "arts"
    elif any(term in field_lower for term in ["education", "teaching", "learning", "instruction"]):
        return "education"
    elif any(term in field_lower for term in ["agriculture", "farming", "crop", "livestock", "food", "plant", "animal"]):
        return "agriculture"
    elif any(term in field_lower for term in ["law", "legal", "justice", "court"]):
        return "law"
    elif any(term in field_lower for term in ["communication", "media", "journalism", "broadcasting", "advertising"]):
        return "media"
    else:
        return "science"  # Default

def generate_research_areas_for_field(field_name):
    """Generate research areas for a specific field"""
    category = get_field_category(field_name)
    base_areas = RESEARCH_AREA_MAPPINGS.get(category, RESEARCH_AREA_MAPPINGS["science"])
    
    # Customize research areas based on field name
    field_specific_areas = []
    
    for area in base_areas:
        # Customize the area name to be field-specific
        if category == "engineering":
            field_specific_areas.append(f"{field_name} {area}")
        elif category == "computer_science":
            field_specific_areas.append(f"{area} in {field_name}")
        else:
            field_specific_areas.append(f"{field_name} {area}")
    
    return field_specific_areas[:20]  # Limit to 20 areas per field

def main():
    # Read the academic fields database
    script_dir = os.path.dirname(os.path.abspath(__file__))
    fields_file = os.path.join(script_dir, "..", "Fields", "academic_fields.json")
    
    with open(fields_file, 'r') as f:
        categories = json.load(f)
    
    # Generate research areas for all fields
    research_areas = []
    field_id = 1
    
    for category in categories:
        print(f"Processing category: {category['category']}")
        for field in category['fields']:
            research_areas_for_field = generate_research_areas_for_field(field)
            
            research_areas.append({
                "id": field_id,
                "field": field,
                "researchAreas": research_areas_for_field
            })
            
            field_id += 1
            print(f"  Generated research areas for: {field}")
    
    # Write the research areas database
    output_file = os.path.join(script_dir, "research_areas.json")
    
    with open(output_file, 'w') as f:
        json.dump(research_areas, f, indent=2)
    
    print(f"\nGenerated research areas for {len(research_areas)} fields!")
    print(f"Total research areas: {sum(len(item['researchAreas']) for item in research_areas)}")
    print(f"Output file: {output_file}")

if __name__ == "__main__":
    main()