import React from 'react';
import PageHeader from '../../components/shared/PageHeader/PageHeader';
import SectionCard from '../../components/shared/SectionCard/SectionCard';
import Button from '../../components/common/Button/Button';
import Tabs from '../../components/shared/Tabs/Tabs';
import FormInput from '../../components/common/Input/FormInput';
import TextArea from '../../components/common/Input/TextArea';
import { cmsSections } from '../../services/api';
import './HomeCMSPage.css';

const HomeCMSPage = () => {
  return (
    <div className="homecms-page">
      <PageHeader title="Home CMS" subtitle="Control website content structure and hero experience for the restaurant brand." />
      <div className="homecms-grid">
        <div className="sections-panel">
          <div className="section-toolbar">
            <h3>Website Sections</h3>
            <Button variant="secondary">Preview Website</Button>
          </div>
          <div className="section-list">
            {cmsSections.map((section) => (
              <SectionCard key={section.id} icon={section.icon} title={section.title} status={section.status} onEdit={() => {}} onDelete={() => {}} />
            ))}
          </div>
        </div>
        <aside className="homecms-right-panel">
          <div className="cms-editor-card">
            <Tabs
              tabs={[
                { key: 'content', label: 'Content' },
                { key: 'images', label: 'Images' },
                { key: 'settings', label: 'Settings' },
                { key: 'seo', label: 'SEO' }
              ]}
              onChange={() => {}}
            />
            <div className="cms-editor-body">
              <FormInput label="Small Heading" placeholder="Example: Fresh meals delivered fast" />
              <FormInput label="Main Heading" placeholder="Your restaurant in every pocket" />
              <TextArea label="Description" placeholder="Write a compelling story for your hero section." rows={4} />
              <FormInput label="Primary CTA" placeholder="Order Now" />
              <FormInput label="Secondary CTA" placeholder="Learn More" />
              <div className="image-pair">
                <FormInput label="Banner Upload" placeholder="Upload banner image" />
                <FormInput label="Mobile Banner Upload" placeholder="Upload mobile image" />
              </div>
            </div>
            <div className="cms-editor-footer">
              <Button variant="outline">Cancel</Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomeCMSPage;
