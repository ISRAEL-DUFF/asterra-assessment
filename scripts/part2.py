import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import Normalize

# Create 1,000x10,000 array with random integers 0-65535
print("Creating array...")
original_array = np.random.randint(0, 65536, size=(1000, 10000), dtype=np.uint16)

# Initialize final array with original values
final_array = original_array.astype(np.float32).copy()

# Create mask for valid calculations (a > 0 to avoid log(0))
valid_mask = original_array > 0

# Calculate Log_data for valid cells
# Using np.where to handle invalid values gracefully
log_data = np.zeros_like(final_array)
log_data[valid_mask] = 10 * np.log10(original_array[valid_mask])

# Apply transformation where Log_data < 13
transform_mask = valid_mask & (log_data < 13)
final_array[transform_mask] = 2 * log_data[transform_mask]

# For cells where Log_data >= 13, keep original value (already copied)

print(f"Array shape: {final_array.shape}")
print(f"Value range: [{final_array.min():.2f}, {final_array.max():.2f}]")
print(f"Cells transformed: {transform_mask.sum()} / {final_array.size}")

# Plot and save the array
print("Creating visualization...")
fig, ax = plt.subplots(figsize=(15, 3))

# Normalize for better visualization
norm = Normalize(vmin=np.percentile(final_array, 1), 
                 vmax=np.percentile(final_array, 99))

im = ax.imshow(final_array, cmap='viridis', aspect='auto', norm=norm)
ax.set_title('Transformed Raster Array (1000×10000)', fontsize=14)
ax.set_xlabel('Column Index')
ax.set_ylabel('Row Index')

# Add colorbar
cbar = plt.colorbar(im, ax=ax, label='Transformed Value')

plt.tight_layout()
plt.savefig('raster_output.png', dpi=150, bbox_inches='tight')
print("Image saved as 'raster_output.png'")

plt.show()

# Optional: Save as different formats
# plt.savefig('raster_output.jpg', dpi=150, bbox_inches='tight')
# plt.savefig('raster_output.tiff', dpi=150, bbox_inches='tight')