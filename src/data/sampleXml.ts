export interface SampleFile {
  name: string;
  description: string;
  content: string;
}

export const sampleFiles: SampleFile[] = [
  {
    name: "project-config.xml",
    description: "Project configuration file",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project name="Automation" version="2.1.0">
  <metadata>
    <author>Development Team</author>
    <created>2025-01-15</created>
    <lastModified>2026-03-20</lastModified>
  </metadata>
  <settings>
    <theme>dark</theme>
    <language>en-US</language>
    <autoSave enabled="true" interval="30" />
    <backup enabled="true" location="/backups" />
  </settings>
  <modules>
    <module id="parser" active="true">
      <name>XML Parser</name>
      <description>Core XML parsing engine</description>
      <version>1.5.2</version>
    </module>
    <module id="validator" active="true">
      <name>Schema Validator</name>
      <description>XSD schema validation</description>
      <version>2.0.1</version>
    </module>
    <module id="transformer" active="false">
      <name>XSLT Transformer</name>
      <description>XSLT transformation engine</description>
      <version>1.2.0</version>
    </module>
  </modules>
  <dependencies>
    <dependency name="core-lib" version="3.0.0" />
    <dependency name="utils" version="1.8.5" />
    <dependency name="logger" version="2.1.0" />
  </dependencies>
</project>`
  },
  {
    name: "employees.xml",
    description: "Employee directory data",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<company name="TechCorp Inc.">
  <department name="Engineering" id="ENG-001">
    <manager>
      <name>Sarah Johnson</name>
      <email>sarah.j@techcorp.com</email>
      <phone ext="4501">+1-555-0100</phone>
    </manager>
    <employees>
      <employee id="E001" role="Senior Developer">
        <name>James Chen</name>
        <email>james.c@techcorp.com</email>
        <hireDate>2022-03-15</hireDate>
        <skills>
          <skill level="expert">Java</skill>
          <skill level="advanced">Python</skill>
          <skill level="intermediate">Go</skill>
        </skills>
      </employee>
      <employee id="E002" role="Frontend Developer">
        <name>Maria Garcia</name>
        <email>maria.g@techcorp.com</email>
        <hireDate>2023-07-01</hireDate>
        <skills>
          <skill level="expert">React</skill>
          <skill level="expert">TypeScript</skill>
          <skill level="advanced">CSS</skill>
        </skills>
      </employee>
      <employee id="E003" role="DevOps Engineer">
        <name>Alex Kim</name>
        <email>alex.k@techcorp.com</email>
        <hireDate>2021-11-20</hireDate>
        <skills>
          <skill level="expert">Docker</skill>
          <skill level="expert">Kubernetes</skill>
          <skill level="advanced">AWS</skill>
        </skills>
      </employee>
    </employees>
  </department>
  <department name="Design" id="DES-002">
    <manager>
      <name>David Park</name>
      <email>david.p@techcorp.com</email>
      <phone ext="3200">+1-555-0200</phone>
    </manager>
    <employees>
      <employee id="E004" role="UX Designer">
        <name>Emily Watson</name>
        <email>emily.w@techcorp.com</email>
        <hireDate>2023-01-10</hireDate>
        <skills>
          <skill level="expert">Figma</skill>
          <skill level="advanced">User Research</skill>
        </skills>
      </employee>
    </employees>
  </department>
</company>`
  },
  {
    name: "api-response.xml",
    description: "REST API response example",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<response status="200" timestamp="2026-03-20T14:30:00Z">
  <headers>
    <header name="Content-Type">application/xml</header>
    <header name="X-Request-Id">req-abc-123-def</header>
    <header name="X-RateLimit-Remaining">98</header>
  </headers>
  <body>
    <users total="3" page="1" perPage="10">
      <user id="101">
        <username>jdoe</username>
        <displayName>John Doe</displayName>
        <email>jdoe@example.com</email>
        <status>active</status>
        <roles>
          <role>admin</role>
          <role>editor</role>
        </roles>
        <preferences>
          <notifications enabled="true" />
          <language>en</language>
          <timezone>America/New_York</timezone>
        </preferences>
      </user>
      <user id="102">
        <username>asmith</username>
        <displayName>Alice Smith</displayName>
        <email>asmith@example.com</email>
        <status>active</status>
        <roles>
          <role>editor</role>
        </roles>
        <preferences>
          <notifications enabled="false" />
          <language>fr</language>
          <timezone>Europe/Paris</timezone>
        </preferences>
      </user>
      <user id="103">
        <username>bwilson</username>
        <displayName>Bob Wilson</displayName>
        <email>bwilson@example.com</email>
        <status>inactive</status>
        <roles>
          <role>viewer</role>
        </roles>
        <preferences>
          <notifications enabled="true" />
          <language>en</language>
          <timezone>Asia/Tokyo</timezone>
        </preferences>
      </user>
    </users>
  </body>
  <pagination>
    <currentPage>1</currentPage>
    <totalPages>1</totalPages>
    <totalItems>3</totalItems>
  </pagination>
</response>`
  },
  {
    name: "build-pipeline.xml",
    description: "CI/CD build pipeline configuration",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<pipeline name="main-build" trigger="push">
  <stages>
    <stage name="checkout" order="1">
      <step type="git-checkout">
        <repository>https://github.com/techcorp/automation.git</repository>
        <branch>main</branch>
        <depth>1</depth>
      </step>
    </stage>
    <stage name="install" order="2">
      <step type="shell">
        <command>npm ci</command>
        <timeout>300</timeout>
      </step>
    </stage>
    <stage name="test" order="3">
      <parallel>
        <step type="shell" name="unit-tests">
          <command>npm run test:unit</command>
          <timeout>600</timeout>
          <coverage threshold="80" />
        </step>
        <step type="shell" name="integration-tests">
          <command>npm run test:integration</command>
          <timeout>900</timeout>
          <coverage threshold="70" />
        </step>
        <step type="shell" name="lint">
          <command>npm run lint</command>
          <timeout>120</timeout>
        </step>
      </parallel>
    </stage>
    <stage name="build" order="4">
      <step type="shell">
        <command>npm run build</command>
        <artifacts>
          <path>dist/**</path>
          <path>package.json</path>
        </artifacts>
      </step>
    </stage>
    <stage name="deploy" order="5">
      <condition>branch == 'main'</condition>
      <step type="deploy">
        <target>production</target>
        <strategy>rolling</strategy>
        <rollback enabled="true" />
      </step>
    </stage>
  </stages>
  <notifications>
    <onSuccess>
      <channel>slack</channel>
      <message>Build {pipeline.name} succeeded!</message>
    </onSuccess>
    <onFailure>
      <channel>slack</channel>
      <channel>email</channel>
      <message>Build {pipeline.name} failed at stage {stage.name}</message>
    </onFailure>
  </notifications>
</pipeline>`
  }
];
