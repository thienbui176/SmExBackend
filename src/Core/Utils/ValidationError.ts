function flattenValidationErrors(errors: any, error: any) {
    if (error?.constraints) {
        errors[error.property] = Object.values(error.constraints);
    }

    if (error?.children?.length > 0) {
        error.children.forEach((childError) => {
            flattenValidationErrors(errors, childError);
        });
    }
}

function handleValidationErrors(validationErrors: any) {
    const errors: any = {};

    validationErrors.forEach((error) => {
        flattenValidationErrors(errors, error);
    });

    return errors;
}

export { handleValidationErrors };
