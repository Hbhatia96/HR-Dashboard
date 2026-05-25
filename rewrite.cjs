const fs = require('fs');

const lines = fs.readFileSync('src/App.tsx', 'utf-8').split('\n');

const headerImportIdx = lines.findIndex(line => line.includes("import { DirectoryTab }"));
const importsToInject = [
  "import { FormModal } from './components/organisms/FormModal';",
  "import { ViewProfileModal } from './components/organisms/ViewProfileModal';",
  "import { DeleteConfirmModal } from './components/organisms/DeleteConfirmModal';"
];
lines.splice(headerImportIdx + 1, 0, ...importsToInject);

const modalsIdx = lines.findIndex(line => line.includes('{/* MODALS */}'));

const modalsContent = `      {/* MODALS */}
      <FormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        filterOptions={filterOptions}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        handleFormSubmit={handleFormSubmit}
      />
      
      <ViewProfileModal 
        selectedEmployeeForView={selectedEmployeeForView}
        setSelectedEmployeeForView={setSelectedEmployeeForView}
        openEditEmployeeModal={openEditEmployeeModal}
        setEmployeeToDelete={setEmployeeToDelete}
        formatCurrency={formatCurrency}
        formatTableCurrency={formatTableCurrency}
        renderSalaryReferenceCompare={renderSalaryReferenceCompare}
      />
      
      <DeleteConfirmModal 
        employeeToDelete={employeeToDelete}
        setEmployeeToDelete={setEmployeeToDelete}
        handleDeleteEmployee={handleDeleteEmployee}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
`;

const result = lines.slice(0, modalsIdx).join('\n') + '\n' + modalsContent;
fs.writeFileSync('src/App.tsx', result);
