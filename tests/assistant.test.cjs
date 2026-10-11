const test = require('node:test');
const assert = require('node:assert/strict');
const assistant = require('../js/assistant.js');
const records = [...assistant.cvFacts,
  {id:'skills',title:'Technical skills',tags:['skills','programming'],text:'HTML, PHP, JavaScript',href:'#stack'},
  {id:'projects',title:'Portfolio projects',tags:['projects','built'],text:'Campus Express',href:'#projects'},
  {id:'project-1',title:'Campus Express',tags:['campus','campusexpress'],text:'A food marketplace.',href:'project-1.html'},
  {id:'experience',title:'Work experience',tags:['experience','work history'],text:'Afriboards Consultant: software development / frontend development, January - September 2026. MTN Uganda Headquarters: Customer Experience Centre internship, June - August 2026. Volunteer system auditing at Lapok Ventures: April, one month (year not specified).',href:'#experience'},
  {id:'contact',title:'Contact Given',tags:['contact','email','github'],text:'Contact links',href:'#contact'}
];
function ids(question) {return assistant.answer(question,records).entries.map(entry=>entry.id);}
test('Hiring does not match the greeting hi',()=>assert.equal(ids('Are you hiring?')[0],'availability'));
test('CV questions return the actual document',()=>assert.equal(ids('Can I download your CV?')[0],'resume'));
test('Specific project names beat a generic projects request',()=>assert.equal(ids('Tell me about the Campus Express project')[0],'project-1'));
test('EFRIS is identified as research, not a completed deployment',()=>{
  const result=assistant.answer('Is EFRIS integration done?',records);
  assert.equal(result.entries[0].id,'lapok-dms');
  assert.match(result.entries[0].text,/does not say.*deployed/);
});
test('Spoken and programming languages have different answers',()=>{
  assert.equal(ids('What languages do you speak?')[0],'languages');
  assert.equal(ids('What programming languages do you use?')[0],'skills');
});
test('Experience with Afriboards beats a broad work question',()=>assert.equal(ids('What experience do you have at Afriboards?')[0],'afriboards'));
test('School, certifications and payments retrieve CV facts',()=>{
  assert.equal(ids('Which university?')[0],'education');
  assert.equal(ids('What Cisco certifications?')[0],'certifications');
  assert.equal(ids('Tell me about Airtel payouts')[0],'payments');
});
test('Unsupported questions do not invent answers',()=>{
  assert.equal(assistant.answer('What is your salary?',records).kind,'unknown');
  assert.equal(assistant.answer('What is the weather tomorrow?',records).kind,'unknown');
});
test('Follow-ups stay with the previous topic',()=>assert.equal(assistant.answer('Tell me more',records,'lapok-dms').entries[0].id,'lapok-dms'));
test('Greeting can include a substantive question',()=>assert.equal(ids('Hi, can I download your resume?')[0],'resume'));
