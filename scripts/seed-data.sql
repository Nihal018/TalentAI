-- First, insert some users (employers and job seekers)
INSERT INTO users (id, role, name, email, profile_data) VALUES
-- Employers
('550e8400-e29b-41d4-a716-446655440001', 'employer', 'TechCorp HR', 'hr@techcorp.com', '{"company": "TechCorp"}'),
('550e8400-e29b-41d4-a716-446655440002', 'employer', 'StartupXYZ Hiring', 'jobs@startupxyz.com', '{"company": "StartupXYZ"}'),
('550e8400-e29b-41d4-a716-446655440003', 'employer', 'MegaBank Recruiter', 'careers@megabank.com', '{"company": "MegaBank"}'),
('550e8400-e29b-41d4-a716-446655440004', 'employer', 'HealthTech Solutions', 'hr@healthtech.com', '{"company": "HealthTech Solutions"}'),
('550e8400-e29b-41d4-a716-446655440005', 'employer', 'GreenEnergy Inc', 'recruiting@greenenergy.com', '{"company": "GreenEnergy Inc"}'),
-- Job Seekers
('550e8400-e29b-41d4-a716-446655440006', 'job_seeker', 'John Doe', 'john.doe@email.com', '{"skills": ["JavaScript", "React", "Node.js"], "experience": "5 years", "location": "San Francisco, CA"}'),
('550e8400-e29b-41d4-a716-446655440007', 'job_seeker', 'Jane Smith', 'jane.smith@email.com', '{"skills": ["Python", "Django", "Machine Learning"], "experience": "3 years", "location": "New York, NY"}'),
-- Admin
('550e8400-e29b-41d4-a716-446655440008', 'admin', 'System Admin', 'admin@jobplatform.com', '{"role": "system_administrator"}');

-- Now insert jobs with proper employer references
INSERT INTO jobs (employer_id, title, company, description, location, salary, type, requirements, skills, status, remote, experience, company_logo, benefits) VALUES

-- TechCorp Jobs
('550e8400-e29b-41d4-a716-446655440001', 'Senior Frontend Developer', 'TechCorp', 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using modern JavaScript frameworks.', 'San Francisco, CA', '$120,000 - $150,000', 'Full-time', ARRAY['5+ years React experience', 'Strong JavaScript skills', 'Experience with TypeScript'], ARRAY['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'], 'active', true, 'Senior', '/placeholder.svg?height=40&width=40&text=TC', ARRAY['Health insurance', 'Remote work', '401k matching']),

('550e8400-e29b-41d4-a716-446655440001', 'Backend Engineer', 'TechCorp', 'Join our backend team to build scalable APIs and microservices. You will work with modern technologies including Node.js, Python, and cloud platforms.', 'San Francisco, CA', '$110,000 - $140,000', 'Full-time', ARRAY['3+ years backend development', 'Experience with databases', 'Cloud platform knowledge'], ARRAY['Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=TC', ARRAY['Health insurance', 'Stock options', 'Flexible hours']),

('550e8400-e29b-41d4-a716-446655440001', 'DevOps Engineer', 'TechCorp', 'We need a DevOps Engineer to manage our infrastructure and deployment pipelines. Experience with Kubernetes and CI/CD is essential.', 'San Francisco, CA', '$130,000 - $160,000', 'Full-time', ARRAY['Kubernetes experience', 'CI/CD pipeline setup', 'Infrastructure as Code'], ARRAY['Kubernetes', 'Docker', 'Jenkins', 'Terraform', 'AWS'], 'active', true, 'Senior', '/placeholder.svg?height=40&width=40&text=TC', ARRAY['Health insurance', 'Remote work', 'Training budget']),

-- StartupXYZ Jobs
('550e8400-e29b-41d4-a716-446655440002', 'Full Stack Developer', 'StartupXYZ', 'Looking for a versatile Full Stack Developer to work on our innovative product. You will work across the entire tech stack from frontend to backend.', 'Austin, TX', '$90,000 - $120,000', 'Full-time', ARRAY['Full stack development experience', 'Startup environment adaptability', 'Problem-solving skills'], ARRAY['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'], 'active', false, 'Mid-level', '/placeholder.svg?height=40&width=40&text=XYZ', ARRAY['Equity', 'Flexible PTO', 'Learning stipend']),

('550e8400-e29b-41d4-a716-446655440002', 'Product Manager', 'StartupXYZ', 'We are seeking a Product Manager to drive our product strategy and work closely with engineering and design teams.', 'Austin, TX', '$100,000 - $130,000', 'Full-time', ARRAY['Product management experience', 'Agile methodology', 'Stakeholder management'], ARRAY['Product Strategy', 'Agile', 'Analytics', 'User Research', 'Roadmapping'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=XYZ', ARRAY['Equity', 'Health insurance', 'Conference budget']),

('550e8400-e29b-41d4-a716-446655440002', 'UX/UI Designer', 'StartupXYZ', 'Creative UX/UI Designer needed to design intuitive and beautiful user experiences for our growing platform.', 'Austin, TX', '$80,000 - $110,000', 'Full-time', ARRAY['Design portfolio', 'User research experience', 'Prototyping skills'], ARRAY['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=XYZ', ARRAY['Equity', 'Design tools budget', 'Flexible hours']),

-- MegaBank Jobs
('550e8400-e29b-41d4-a716-446655440003', 'Software Architect', 'MegaBank', 'Lead the architecture of our next-generation banking platform. You will design scalable, secure systems for millions of users.', 'New York, NY', '$180,000 - $220,000', 'Full-time', ARRAY['10+ years software development', 'Enterprise architecture experience', 'Financial services background preferred'], ARRAY['Java', 'Spring Framework', 'Microservices', 'System Design', 'Security'], 'active', false, 'Senior', '/placeholder.svg?height=40&width=40&text=MB', ARRAY['Comprehensive benefits', 'Bonus eligible', 'Professional development']),

('550e8400-e29b-41d4-a716-446655440003', 'Cybersecurity Specialist', 'MegaBank', 'Join our cybersecurity team to protect our banking infrastructure and customer data from emerging threats.', 'New York, NY', '$140,000 - $170,000', 'Full-time', ARRAY['Cybersecurity certification', 'Incident response experience', 'Financial industry knowledge'], ARRAY['Network Security', 'Penetration Testing', 'SIEM', 'Compliance', 'Risk Assessment'], 'active', false, 'Senior', '/placeholder.svg?height=40&width=40&text=MB', ARRAY['Security clearance bonus', 'Training budget', 'Health insurance']),

('550e8400-e29b-41d4-a716-446655440003', 'Data Scientist', 'MegaBank', 'Use advanced analytics and machine learning to drive business insights and improve customer experiences.', 'New York, NY', '$130,000 - $160,000', 'Full-time', ARRAY['PhD or Masters in related field', 'Machine learning experience', 'Financial modeling'], ARRAY['Python', 'R', 'Machine Learning', 'SQL', 'Statistics'], 'active', true, 'Senior', '/placeholder.svg?height=40&width=40&text=MB', ARRAY['Research budget', 'Conference attendance', 'Health insurance']),

-- HealthTech Solutions Jobs
('550e8400-e29b-41d4-a716-446655440004', 'Healthcare Software Developer', 'HealthTech Solutions', 'Develop software solutions that improve patient care and healthcare outcomes. HIPAA compliance knowledge required.', 'Boston, MA', '$100,000 - $130,000', 'Full-time', ARRAY['Healthcare software experience', 'HIPAA compliance knowledge', 'Database management'], ARRAY['Java', 'Spring Boot', 'MySQL', 'HIPAA', 'Healthcare APIs'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=HT', ARRAY['Health insurance', 'Mission-driven work', 'Professional development']),

('550e8400-e29b-41d4-a716-446655440004', 'Mobile App Developer', 'HealthTech Solutions', 'Build mobile applications that help patients manage their health and connect with healthcare providers.', 'Boston, MA', '$95,000 - $125,000', 'Full-time', ARRAY['iOS/Android development', 'Healthcare app experience preferred', 'UI/UX sensitivity'], ARRAY['Swift', 'Kotlin', 'React Native', 'Mobile UI/UX', 'API Integration'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=HT', ARRAY['Health insurance', 'Device stipend', 'Flexible schedule']),

('550e8400-e29b-41d4-a716-446655440004', 'QA Engineer', 'HealthTech Solutions', 'Ensure the quality and reliability of our healthcare software through comprehensive testing strategies.', 'Boston, MA', '$80,000 - $105,000', 'Full-time', ARRAY['QA methodology experience', 'Automated testing', 'Healthcare software testing preferred'], ARRAY['Selenium', 'Jest', 'Cypress', 'Test Automation', 'Manual Testing'], 'active', false, 'Mid-level', '/placeholder.svg?height=40&width=40&text=HT', ARRAY['Health insurance', 'Training opportunities', 'Work-life balance']),

-- GreenEnergy Inc Jobs
('550e8400-e29b-41d4-a716-446655440005', 'Renewable Energy Data Analyst', 'GreenEnergy Inc', 'Analyze energy production data and optimize renewable energy systems for maximum efficiency and sustainability.', 'Denver, CO', '$85,000 - $110,000', 'Full-time', ARRAY['Data analysis experience', 'Energy sector knowledge', 'Statistical modeling'], ARRAY['Python', 'R', 'Tableau', 'SQL', 'Energy Analytics'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=GE', ARRAY['Green mission', 'Health insurance', 'Outdoor activities budget']),

('550e8400-e29b-41d4-a716-446655440005', 'IoT Systems Engineer', 'GreenEnergy Inc', 'Design and implement IoT solutions for monitoring and controlling renewable energy installations.', 'Denver, CO', '$110,000 - $140,000', 'Full-time', ARRAY['IoT development experience', 'Embedded systems', 'Wireless communication protocols'], ARRAY['IoT', 'Embedded C', 'LoRaWAN', 'MQTT', 'Edge Computing'], 'active', false, 'Senior', '/placeholder.svg?height=40&width=40&text=GE', ARRAY['Environmental impact', 'Stock options', 'Professional development']),

-- Additional diverse jobs across different companies
('550e8400-e29b-41d4-a716-446655440001', 'Technical Writer', 'TechCorp', 'Create comprehensive technical documentation for our software products and APIs.', 'San Francisco, CA', '$75,000 - $95,000', 'Full-time', ARRAY['Technical writing experience', 'Software documentation', 'API documentation'], ARRAY['Technical Writing', 'Documentation Tools', 'Markdown', 'Git', 'Software Knowledge'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=TC', ARRAY['Health insurance', 'Remote work', 'Writing tools stipend']),

('550e8400-e29b-41d4-a716-446655440002', 'Marketing Manager', 'StartupXYZ', 'Lead our marketing efforts to grow user acquisition and brand awareness in the competitive startup landscape.', 'Austin, TX', '$90,000 - $115,000', 'Full-time', ARRAY['Digital marketing experience', 'Growth hacking', 'Analytics proficiency'], ARRAY['Digital Marketing', 'SEO/SEM', 'Content Marketing', 'Analytics', 'Social Media'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=XYZ', ARRAY['Equity', 'Marketing budget', 'Conference attendance']),

('550e8400-e29b-41d4-a716-446655440003', 'Compliance Officer', 'MegaBank', 'Ensure regulatory compliance across all banking operations and help navigate complex financial regulations.', 'New York, NY', '$120,000 - $150,000', 'Full-time', ARRAY['Financial compliance experience', 'Regulatory knowledge', 'Risk assessment'], ARRAY['Regulatory Compliance', 'Risk Management', 'Financial Regulations', 'Audit', 'Documentation'], 'active', false, 'Senior', '/placeholder.svg?height=40&width=40&text=MB', ARRAY['Compliance training', 'Legal support', 'Professional certification']),

('550e8400-e29b-41d4-a716-446655440004', 'Clinical Data Manager', 'HealthTech Solutions', 'Manage clinical trial data and ensure data integrity for healthcare research projects.', 'Boston, MA', '$95,000 - $120,000', 'Full-time', ARRAY['Clinical data experience', 'GCP knowledge', 'Database management'], ARRAY['Clinical Data Management', 'EDC Systems', 'SAS', 'R', 'GCP'], 'active', false, 'Senior', '/placeholder.svg?height=40&width=40&text=HT', ARRAY['Healthcare benefits', 'Research opportunities', 'Continuing education']),

('550e8400-e29b-41d4-a716-446655440005', 'Sustainability Consultant', 'GreenEnergy Inc', 'Help organizations transition to renewable energy solutions and develop sustainability strategies.', 'Denver, CO', '$80,000 - $105,000', 'Full-time', ARRAY['Sustainability consulting', 'Renewable energy knowledge', 'Project management'], ARRAY['Sustainability Planning', 'Renewable Energy', 'Project Management', 'Environmental Analysis', 'Client Relations'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=GE', ARRAY['Environmental mission', 'Travel opportunities', 'Professional development']),

-- Junior and Entry-level positions
('550e8400-e29b-41d4-a716-446655440001', 'Junior Software Developer', 'TechCorp', 'Start your career with us as a Junior Software Developer. We provide mentorship and training opportunities.', 'San Francisco, CA', '$80,000 - $100,000', 'Full-time', ARRAY['Computer Science degree or bootcamp', 'Basic programming knowledge', 'Eagerness to learn'], ARRAY['JavaScript', 'HTML', 'CSS', 'Git', 'Problem Solving'], 'active', true, 'Entry-level', '/placeholder.svg?height=40&width=40&text=TC', ARRAY['Mentorship program', 'Health insurance', 'Learning budget']),

('550e8400-e29b-41d4-a716-446655440002', 'Sales Development Representative', 'StartupXYZ', 'Join our sales team to help drive revenue growth and build relationships with potential customers.', 'Austin, TX', '$50,000 - $70,000 + commission', 'Full-time', ARRAY['Sales experience preferred', 'Communication skills', 'CRM knowledge'], ARRAY['Sales', 'CRM', 'Communication', 'Lead Generation', 'Customer Relations'], 'active', false, 'Entry-level', '/placeholder.svg?height=40&width=40&text=XYZ', ARRAY['Commission structure', 'Sales training', 'Career progression']),

('550e8400-e29b-41d4-a716-446655440003', 'Financial Analyst', 'MegaBank', 'Analyze financial data and support investment decisions in our corporate banking division.', 'New York, NY', '$85,000 - $105,000', 'Full-time', ARRAY['Finance degree', 'Excel proficiency', 'Analytical skills'], ARRAY['Financial Analysis', 'Excel', 'Financial Modeling', 'Bloomberg Terminal', 'Presentation Skills'], 'active', false, 'Entry-level', '/placeholder.svg?height=40&width=40&text=MB', ARRAY['Training program', 'Health insurance', 'Tuition reimbursement']),

-- Contract and Part-time positions
('550e8400-e29b-41d4-a716-446655440004', 'UI/UX Consultant', 'HealthTech Solutions', 'Contract position to redesign our patient portal interface and improve user experience.', 'Boston, MA', '$75 - $100/hour', 'Contract', ARRAY['UI/UX design portfolio', 'Healthcare experience preferred', 'User research skills'], ARRAY['UI/UX Design', 'Figma', 'User Research', 'Prototyping', 'Healthcare UX'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=HT', ARRAY['Flexible schedule', 'Portfolio project', 'Potential for full-time']),

('550e8400-e29b-41d4-a716-446655440005', 'Part-time Data Entry Specialist', 'GreenEnergy Inc', 'Part-time position for entering and maintaining renewable energy project data.', 'Denver, CO', '$20 - $25/hour', 'Part-time', ARRAY['Data entry experience', 'Attention to detail', 'Excel proficiency'], ARRAY['Data Entry', 'Excel', 'Attention to Detail', 'Database Management', 'Quality Control'], 'active', false, 'Entry-level', '/placeholder.svg?height=40&width=40&text=GE', ARRAY['Flexible hours', 'Part-time benefits', 'Growth opportunities']),

-- Remote-first positions
('550e8400-e29b-41d4-a716-446655440001', 'Remote Content Strategist', 'TechCorp', 'Develop content strategy for our technical blog and marketing materials. Fully remote position.', 'Remote', '$70,000 - $90,000', 'Full-time', ARRAY['Content strategy experience', 'Technical writing', 'SEO knowledge'], ARRAY['Content Strategy', 'Technical Writing', 'SEO', 'Content Management', 'Analytics'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=TC', ARRAY['Fully remote', 'Home office stipend', 'Health insurance']),

('550e8400-e29b-41d4-a716-446655440002', 'Remote Customer Success Manager', 'StartupXYZ', 'Help our customers succeed with our platform while working from anywhere in the US.', 'Remote', '$80,000 - $100,000', 'Full-time', ARRAY['Customer success experience', 'SaaS background', 'Communication skills'], ARRAY['Customer Success', 'SaaS', 'Account Management', 'Problem Solving', 'CRM'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=XYZ', ARRAY['Fully remote', 'Equity', 'Professional development']),

-- Leadership positions
('550e8400-e29b-41d4-a716-446655440003', 'Engineering Manager', 'MegaBank', 'Lead a team of 8-10 engineers building critical banking infrastructure and payment systems.', 'New York, NY', '$200,000 - $250,000', 'Full-time', ARRAY['Engineering management experience', 'Financial services background', 'Team leadership'], ARRAY['Engineering Management', 'Team Leadership', 'System Architecture', 'Agile', 'Performance Management'], 'active', false, 'Executive', '/placeholder.svg?height=40&width=40&text=MB', ARRAY['Executive benefits', 'Bonus eligible', 'Leadership training']),

('550e8400-e29b-41d4-a716-446655440004', 'VP of Product', 'HealthTech Solutions', 'Lead product strategy and vision for our healthcare technology platform.', 'Boston, MA', '$180,000 - $220,000', 'Full-time', ARRAY['VP-level product experience', 'Healthcare industry knowledge', 'Strategic thinking'], ARRAY['Product Strategy', 'Healthcare Technology', 'Strategic Planning', 'Team Leadership', 'Market Analysis'], 'active', false, 'Executive', '/placeholder.svg?height=40&width=40&text=HT', ARRAY['Executive package', 'Stock options', 'Healthcare mission']),

-- Specialized technical roles
('550e8400-e29b-41d4-a716-446655440005', 'Machine Learning Engineer', 'GreenEnergy Inc', 'Apply machine learning to optimize renewable energy production and predict maintenance needs.', 'Denver, CO', '$130,000 - $160,000', 'Full-time', ARRAY['ML engineering experience', 'Python proficiency', 'Energy sector interest'], ARRAY['Machine Learning', 'Python', 'TensorFlow', 'Energy Analytics', 'Time Series Analysis'], 'active', true, 'Senior', '/placeholder.svg?height=40&width=40&text=GE', ARRAY['Cutting-edge technology', 'Environmental impact', 'Research opportunities']),

('550e8400-e29b-41d4-a716-446655440003', 'Blockchain Developer', 'MegaBank', 'Develop blockchain solutions for secure financial transactions and digital currency initiatives.', 'New York, NY', '$150,000 - $180,000', 'Full-time', ARRAY['Blockchain development experience', 'Solidity programming', 'Cryptography knowledge'], ARRAY['Blockchain', 'Solidity', 'Ethereum', 'Smart Contracts', 'Cryptography'], 'active', false, 'Senior', '/placeholder.svg?height=40&width=40&text=MB', ARRAY['Innovation bonus', 'Professional development', 'Cutting-edge projects']),

-- International positions
('550e8400-e29b-41d4-a716-446655440001', 'International Sales Manager', 'TechCorp', 'Manage sales operations across European markets and build international partnerships.', 'London, UK', '£80,000 - £100,000', 'Full-time', ARRAY['International sales experience', 'European market knowledge', 'Language skills preferred'], ARRAY['International Sales', 'Business Development', 'Cross-cultural Communication', 'Market Analysis', 'Partnership Management'], 'active', false, 'Senior', '/placeholder.svg?height=40&width=40&text=TC', ARRAY['International experience', 'Travel opportunities', 'Relocation assistance']),

-- Internship positions
('550e8400-e29b-41d4-a716-446655440002', 'Software Engineering Intern', 'StartupXYZ', 'Summer internship program for computer science students to gain real-world development experience.', 'Austin, TX', '$25 - $35/hour', 'Internship', ARRAY['Currently enrolled in CS program', 'Basic programming knowledge', 'Enthusiasm for learning'], ARRAY['Programming Fundamentals', 'Web Development', 'Version Control', 'Team Collaboration', 'Learning Agility'], 'active', false, 'Internship', '/placeholder.svg?height=40&width=40&text=XYZ', ARRAY['Mentorship program', 'Learning opportunities', 'Potential full-time offer']),

('550e8400-e29b-41d4-a716-446655440004', 'Healthcare Data Intern', 'HealthTech Solutions', 'Internship opportunity to work with healthcare data and contribute to meaningful patient outcomes.', 'Boston, MA', '$22 - $28/hour', 'Internship', ARRAY['Statistics or Data Science major', 'Interest in healthcare', 'Python basics'], ARRAY['Data Analysis', 'Python', 'Healthcare Data', 'Statistics', 'Research Methods'], 'active', false, 'Internship', '/placeholder.svg?height=40&width=40&text=HT', ARRAY['Healthcare mission', 'Learning experience', 'Professional network']),

-- Creative roles
('550e8400-e29b-41d4-a716-446655440002', 'Brand Designer', 'StartupXYZ', 'Shape our brand identity and create compelling visual designs for our growing startup.', 'Austin, TX', '$70,000 - $90,000', 'Full-time', ARRAY['Brand design portfolio', 'Creative software proficiency', 'Startup experience preferred'], ARRAY['Brand Design', 'Adobe Creative Suite', 'Typography', 'Brand Strategy', 'Visual Identity'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=XYZ', ARRAY['Creative freedom', 'Design tools budget', 'Brand impact']),

('550e8400-e29b-41d4-a716-446655440005', 'Environmental Communications Specialist', 'GreenEnergy Inc', 'Communicate our environmental mission and create compelling content about renewable energy.', 'Denver, CO', '$65,000 - $85,000', 'Full-time', ARRAY['Environmental communications', 'Content creation', 'Social media management'], ARRAY['Environmental Communication', 'Content Creation', 'Social Media', 'Sustainability Marketing', 'Public Relations'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=GE', ARRAY['Environmental mission', 'Creative projects', 'Industry impact']),

-- Operations roles
('550e8400-e29b-41d4-a716-446655440003', 'Operations Analyst', 'MegaBank', 'Analyze operational processes and identify opportunities for efficiency improvements in banking operations.', 'New York, NY', '$90,000 - $115,000', 'Full-time', ARRAY['Operations analysis experience', 'Process improvement', 'Financial industry knowledge'], ARRAY['Operations Analysis', 'Process Improvement', 'Data Analysis', 'Project Management', 'Financial Operations'], 'active', false, 'Mid-level', '/placeholder.svg?height=40&width=40&text=MB', ARRAY['Process optimization', 'Professional development', 'Operations impact']),

('550e8400-e29b-41d4-a716-446655440004', 'Supply Chain Coordinator', 'HealthTech Solutions', 'Coordinate medical device supply chain and ensure timely delivery of healthcare solutions.', 'Boston, MA', '$60,000 - $80,000', 'Full-time', ARRAY['Supply chain experience', 'Healthcare industry preferred', 'Logistics coordination'], ARRAY['Supply Chain Management', 'Logistics', 'Vendor Management', 'Healthcare Regulations', 'Inventory Management'], 'active', false, 'Mid-level', '/placeholder.svg?height=40&width=40&text=HT', ARRAY['Healthcare impact', 'Process improvement', 'Cross-functional collaboration']),

-- Customer-facing roles
('550e8400-e29b-41d4-a716-446655440001', 'Technical Support Engineer', 'TechCorp', 'Provide technical support to enterprise customers and help them succeed with our platform.', 'San Francisco, CA', '$85,000 - $105,000', 'Full-time', ARRAY['Technical support experience', 'Customer service skills', 'Problem-solving abilities'], ARRAY['Technical Support', 'Customer Service', 'Troubleshooting', 'Communication', 'Product Knowledge'], 'active', true, 'Mid-level', '/placeholder.svg?height=40&width=40&text=TC', ARRAY['Customer impact', 'Technical learning', 'Support team culture']),

('550e8400-e29b-41d4-a716-446655440005', 'Field Service Technician', 'GreenEnergy Inc', 'Install and maintain renewable energy systems at customer locations across the region.', 'Denver, CO', '$55,000 - $75,000', 'Full-time', ARRAY['Electrical experience', 'Field service background', 'Travel willingness'], ARRAY['Electrical Systems', 'Renewable Energy', 'Field Service', 'Problem Solving', 'Customer Relations'], 'active', false, 'Mid-level', '/placeholder.svg?height=40&width=40&text=GE', ARRAY['Field work variety', 'Technical training', 'Environmental impact']);

-- Insert some sample resumes
INSERT INTO resumes (user_id, raw_url, json) VALUES
('550e8400-e29b-41d4-a716-446655440006', '/uploads/john_doe_resume.pdf', '{"name": "John Doe", "skills": ["JavaScript", "React", "Node.js"], "experience": "5 years software development", "education": "BS Computer Science"}'),
('550e8400-e29b-41d4-a716-446655440007', '/uploads/jane_smith_resume.pdf', '{"name": "Jane Smith", "skills": ["Python", "Django", "Machine Learning"], "experience": "3 years data science", "education": "MS Data Science"}');

-- Insert some sample applications
INSERT INTO applications (job_id, resume_id, status, score) 
SELECT 
  j.id,
  r.id,
  'pending',
  85.5
FROM jobs j, resumes r 
WHERE j.title = 'Senior Frontend Developer' AND r.user_id = '550e8400-e29b-41d4-a716-446655440006'
LIMIT 1;

INSERT INTO applications (job_id, resume_id, status, score) 
SELECT 
  j.id,
  r.id,
  'qualified',
  92.0
FROM jobs j, resumes r 
WHERE j.title = 'Data Scientist' AND r.user_id = '550e8400-e29b-41d4-a716-446655440007'
LIMIT 1;
