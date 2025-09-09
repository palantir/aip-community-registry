from pyspark.sql import DataFrame
from pyspark.sql import functions as F


def flatten_struct(df: DataFrame, struct_key: str) -> DataFrame:
    struct_fields = df.schema[struct_key].dataType.fields
    new_columns = [F.col(col) for col in df.columns if col != struct_key] + [
        F.col(f"{struct_key}.{field.name}").alias(field.name) for field in struct_fields
    ]
    return df.select(*new_columns)
